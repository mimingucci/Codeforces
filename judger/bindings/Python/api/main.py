import os
import sys
import subprocess
import logging
import tempfile
import hashlib
import socket
import psutil
import shlex
# import uvicorn
# coding=utf-8
from enum import Enum
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from pathlib import Path

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import _judger 

app = FastAPI()
DEBUG = True
app.debug = DEBUG
# Configure logging (this is required)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")


class Language(Enum):
    C = "C"
    CPP = "Cpp"
    PY3 = "Python3"
    JS = "Javascript"
    JAVA = "Java"
    PHP = "Php"
    GO = "Golang"


# Request model
class CodeExecutionRequest(BaseModel):
    code: str  # C++ source code as a string
    input: str  # Input for the program
    output: str  # Expected output
    time_limit: int
    memory_limit: int
    language: Language


@app.get("/ping")
async def ping():
    return server_info()


@app.post("/judge")
async def run_code(request: CodeExecutionRequest):
    # logging.info("src", request.code)
    compile_config = None
    run_config = None
    match request.language:
        case Language.C:
            compile_config = c_lang_config["compile"]
            run_config = c_lang_config["run"]
        case Language.CPP:
            compile_config = cpp_lang_config["compile"]
            run_config = cpp_lang_config["run"]
        case Language.PY3:
            compile_config = py3_lang_config["compile"]
            run_config = py3_lang_config["run"]
        case Language.JAVA:
            compile_config = java_lang_config["compile"]
            run_config = java_lang_config["run"]
        case Language.PHP:
            run_config = php_lang_config["run"]
        case Language.GO:
            compile_config = go_lang_config["compile"]
            run_config = go_lang_config["run"]
        case Language.JS:
            run_config = js_lang_config["run"]
        case _:
            raise JudgeServerException("Unsupport language!")
       
    seccomp_rule = run_config["seccomp_rule"]    
   
    try:
        # Create a temporary directory for execution
        with tempfile.TemporaryDirectory() as tmpdir:
            # Make sure tmpdir has proper permissions
            os.chmod(tmpdir, 0o777)
           
            # Handle interpreted languages without compile step
            if compile_config is None:
                src_name = run_config["exe_name"]
                src_path = os.path.join(tmpdir, src_name)
                exe_path = src_path
               
                # Write the source code to a file
                with open(src_path, "w") as f:
                    f.write(request.code)
               
                # Make sure the file is executable
                os.chmod(src_path, 0o755)
            else:
                src_path = os.path.join(tmpdir, compile_config["src_name"])
                exe_path = os.path.join(tmpdir, compile_config["exe_name"])

                # Write the source code to a file
                with open(src_path, "w") as f:
                    f.write(request.code)

                compile_command = compile_config["compile_command"]
                compile_command = compile_command.format(
                    src_path=src_path,
                    exe_dir=tmpdir,
                    exe_path=exe_path
                )

                # Compile the source code
                compile_process = subprocess.run(
                    shlex.split(compile_command),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE
                )

                # Check for compilation errors
                if compile_process.returncode != 0:
                    return {
                        "status": "Compilation Error",
                        "error": compile_process.stderr.decode()
                    }
               
                # Make sure the executable has execute permissions
                if os.path.exists(exe_path):
                    os.chmod(exe_path, 0o755)
                    logging.info(f"Set executable permissions on {exe_path}")
                else:
                    logging.warning(f"Executable {exe_path} not found after compilation")

            # Write input data to a file
            input_path = os.path.join(tmpdir, "input.txt")
            output_path = os.path.join(tmpdir, "output.txt")
            error_path = os.path.join(tmpdir, "error.txt")
            
            with open(input_path, "w") as f:
                f.write(request.input)

            run_command = run_config["command"].format(
                exe_path=exe_path,
                exe_dir=tmpdir,
                max_memory=int(request.memory_limit / 1024),
                src_path=src_path  # Added for interpreted languages
            )
            run_args = shlex.split(run_command)
           
            # Log the command being executed for debugging
            logging.info(f"Running command: {run_command}")
            logging.info(f"Run args: {run_args}")
            logging.info(f"File permissions: {oct(os.stat(exe_path).st_mode & 0o777)}")

            # Execute the program using _judger
            result = _judger.run(
                max_cpu_time=request.time_limit,
                max_real_time=request.time_limit * 2,
                max_memory=request.memory_limit,
                max_stack=request.memory_limit,
                max_output_size=100000,
                max_process_number=_judger.UNLIMITED,
                exe_path=run_args[0],
                input_path=input_path,
                output_path=output_path,
                error_path=error_path,
                args=run_args[1:],
                env=run_config.get("env", []),
                log_path="judger.log",
                seccomp_rule_name=seccomp_rule,
                uid=0,  # Run as root
                gid=0,  # Run as root
                memory_limit_check_only=run_config.get("memory_limit_check_only", 0)
            )

            logging.info(f"Judger result: {result}")

            # Read the actual output
            if os.path.exists(output_path):
                logging.info(f"Output file found: {output_path}")
                with open(output_path, "r") as f:
                    actual_output = f.read().strip()
                logging.info(f"Output file content: {actual_output}")
            else:
                logging.warn(f"Output file not found: {output_path}")
                actual_output = ""

            # Check for runtime errors
            if result["result"] != _judger.RESULT_SUCCESS:
                error_message = ""
                if os.path.exists(error_path):
                    with open(error_path, "r") as f:
                        error_message = f.read()
               
                error_reason = "Unknown Error"
                if result["result"] == _judger.RESULT_CPU_TIME_LIMIT_EXCEEDED:
                    error_reason = "Time Limit Exceeded"
                elif result["result"] == _judger.RESULT_REAL_TIME_LIMIT_EXCEEDED:
                    error_reason = "Time Limit Exceeded (Wall Time)"
                elif result["result"] == _judger.RESULT_MEMORY_LIMIT_EXCEEDED:
                    error_reason = "Memory Limit Exceeded"
                elif result["result"] == _judger.RESULT_RUNTIME_ERROR:
                    error_reason = f"Runtime Error (Exit Code: {result['exit_code']})"
               
                return {
                    "status": error_reason,
                    "error": error_message,
                    "result": result
                }

            # Compare actual output with expected output
            if actual_output == request.output.strip():
                return {"status": "Accepted", "output": actual_output}
            else:
                return {
                    "status": "Wrong Answer",
                    "expected": request.output.strip(),
                    "actual": actual_output
                }

    except Exception as e:
        logging.exception("Error during code execution")
        return {"status": "Error", "error": str(e)}
    

@app.middleware("http")
async def check_token_middleware(request: Request, call_next):
    # Extract token from headers
    token = request.headers.get("X-Judge-Server-Token")

    if token is None:
        raise HTTPException(status_code=400, detail="Token is missing")
    
    if token != get_hash_token():
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Continue processing the request
    response = await call_next(request)
    return response


default_env = ["LANG=en_US.UTF-8", "LANGUAGE=en_US:en", "LC_ALL=en_US.UTF-8"]

c_lang_config = {
    "compile": {
        "src_name": "main.c",
        "exe_name": "main",
        "compile_command": "/usr/bin/gcc -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c11 {src_path} -lm -o {exe_path}",
    },
    "run": {
        "command": "{exe_path}",
        "seccomp_rule": "c_cpp",
        "env": []
    }
}

cpp_lang_config = {
    "compile": {
        "src_name": "main.cpp",
        "exe_name": "main",
        "compile_command": "/usr/bin/g++ -DONLINE_JUDGE -O2 -w -fmax-errors=3 -std=c++20 {src_path} -lm -o {exe_path}",
    },
    "run": {
        "command": "{exe_path}",
        "seccomp_rule": "c_cpp",
        "env": []
    }
}

java_lang_config = {
    "compile": {
        "src_name": "Main.java",
        "exe_name": "Main",
        "compile_command": "/usr/bin/javac {src_path} -d {exe_dir} -encoding UTF8"
    },
    "run": {
        "command": "/usr/bin/java -cp {exe_dir} -XX:MaxRAM={max_memory}k -Dfile.encoding=UTF-8 -Djava.awt.headless=true Main",
        "seccomp_rule": None,
        "env": default_env,
        "memory_limit_check_only": 1
    }
}

py3_lang_config = {
    "compile": {
        "src_name": "solution.py",
        "exe_name": "__pycache__/solution.cpython-312.pyc",
        "compile_command": "/usr/bin/python3 -m py_compile {src_path}",
    },
    "run": {
        "command": "/usr/bin/python3 {src_path}", # Use source directly as Python 3.12 caching might differ
        "seccomp_rule": "general",
        "env": ["PYTHONIOENCODING=UTF-8"] + default_env
    }
}

go_lang_config = {
    "compile": {
        "src_name": "main.go",
        "exe_name": "main",
        "compile_command": "/usr/bin/go build -o {exe_path} {src_path}",
        "env": ["GOCACHE=/tmp", "GOPATH=/tmp/go"]
    },
    "run": {
        "command": "{exe_path}",
        "seccomp_rule": "general", # Using "general" instead of empty string for better security
        "env": ["GODEBUG=madvdontneed=1", "GOCACHE=off"] + default_env,
        "memory_limit_check_only": 1
    }
}

php_lang_config = {
    "run": {
        "exe_name": "solution.php",
        "command": "/usr/bin/php {exe_path}",
        "seccomp_rule": "general",
        "env": [],
        "memory_limit_check_only": 1
    }
}

js_lang_config = {
    "run": {
        "exe_name": "solution.js",
        "command": "/usr/bin/node {exe_path}",
        "seccomp_rule": "general",
        "env": ["NODE_OPTIONS=--no-warnings", "NO_COLOR=true"] + default_env,
        "memory_limit_check_only": 1
    }
}


class JudgeServerException(Exception):
    def __init__(self, message):
        super().__init__()
        self.message = message


def server_info():
    ver = _judger.VERSION
    return {"hostname": socket.gethostname(),
            "cpu": psutil.cpu_percent(),
            "cpu_core": psutil.cpu_count(),
            "memory": psutil.virtual_memory().percent,
            "judger_version": ".".join([str((ver >> 16) & 0xff), str((ver >> 8) & 0xff), str(ver & 0xff)])}


def get_token() -> str:
    token = 'toivaban12345' # os.environ.get("TOKEN")
    if token:
        return token
    else:
        raise JudgeServerException("env 'TOKEN' not found")


def get_hash_token() -> str:
    return hashlib.sha256(get_token().encode("utf-8")).hexdigest()


class ProblemIOMode:
    standard = "Standard IO"
    file = "File IO"


if DEBUG:
    logging.info("DEBUG=ON")


# uvicorn main:app --host 0.0.0.0 --port 8000 or fastapi dev main.py
if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    app.run(debug=DEBUG)

