import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import _judger 
import subprocess
import logging
import uuid
import shlex
import shutil
import socket
import asyncio
# import uvicorn
# coding=utf-8
from enum import Enum
import py_eureka_client.eureka_client as eureka_client
from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from languages import *
from exception import JudgeServerException
from util import server_info, get_hash_token
from config import JUDGER_WORKSPACE_BASE, COMPILER_USER_UID, COMPILER_GROUP_GID, RUN_USER_UID, RUN_GROUP_GID, JUDGER_LOG_PATH
from compiler import Compiler


app = FastAPI()
DEBUG = os.environ.get("DEBUG_MODE") == "1"
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

class TestCase(BaseModel): 
    input: str
    output: str

class BatchCodeExecutionRequest(BaseModel):
    code: str  
    time_limit: int
    memory_limit: int
    language: Language
    test_case: list[TestCase]
    rule: str


class InitSubmissionEnv(object):
    def __init__(self, judger_workspace, submission_id):
        self.work_dir = os.path.join(judger_workspace, submission_id)

    def __enter__(self):
        try:
            os.mkdir(self.work_dir)
            os.chown(self.work_dir, COMPILER_USER_UID, RUN_GROUP_GID)
            os.chmod(self.work_dir, 0o711)
        except Exception as e:
            logging.exception(e)
            raise JudgeServerException("failed to create runtime dir")
        return self.work_dir

    def __exit__(self, exc_type, exc_val, exc_tb):
        if not DEBUG:
            try:
                shutil.rmtree(self.work_dir)
            except Exception as e:
                logging.exception(e)
                raise logging("failed to clean runtime dir")


class JudgeServer:
    @classmethod
    def ping(cls):
        return server_info()


    @classmethod
    def judge(cls, request: CodeExecutionRequest):
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
        submission_id = uuid.uuid4().hex
        with InitSubmissionEnv(JUDGER_WORKSPACE_BASE, submission_id) as dirs: 
            tmpdir = dirs
            
            # # Handle interpreted languages without compile step
            # if compile_config is None:
            #     src_name = run_config["exe_name"]
            #     src_path = os.path.join(tmpdir, src_name)
            #     exe_path = src_path
                
            #     # Write the source code to a file
            #     with open(src_path, "w") as f:
            #         f.write(request.code)
                
            #     # Make sure the file is executable
            #     os.chmod(src_path, 0o755)
            # else:
            #     src_path = os.path.join(tmpdir, compile_config["src_name"])
            #     exe_path = os.path.join(tmpdir, compile_config["exe_name"])

            #     # Write the source code to a file
            #     with open(src_path, "w") as f:
            #         f.write(request.code)

            #     os.chown(src_path, COMPILER_USER_UID, 0)
            #     os.chmod(src_path, 0o400)

            #     # compile source code, return exe file path
            #     exe_path = Compiler().compile(compile_config=compile_config,
            #                                   src_path=src_path,
            #                                   output_dir=tmpdir,
            #                                   time_limit=request.time_limit,
            #                                   memory_limit=request.memory_limit)
                
            #     try:
            #         # Java exe_path is SOME_PATH/Main, but the real path is SOME_PATH/Main.class
            #         # We ignore it temporarily
            #         os.chown(exe_path, RUN_USER_UID, 0)
            #         os.chmod(exe_path, 0o500)
            #     except Exception:
            #         pass

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
                max_real_time=request.time_limit,
                max_memory=request.memory_limit,
                max_stack=128 * 1024 * 1024,
                max_output_size=1024 * 1024 * 16,
                max_process_number=_judger.UNLIMITED,
                exe_path=run_args[0],
                input_path=input_path,
                output_path=output_path,
                error_path=error_path,
                args=run_args[1:],
                env=run_config.get("env", []),
                log_path=JUDGER_LOG_PATH,
                seccomp_rule_name=seccomp_rule,
                uid=RUN_USER_UID,  
                gid=RUN_GROUP_GID, 
                memory_limit_check_only=run_config.get("memory_limit_check_only", 0)
            )

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
                    "real_time_ms": result.get('real_time', 0),
                    "memory_bytes": result.get('memory', 0),
                    "status": error_reason,
                    "error": error_message,
                    "result": result
                }

            # Compare actual output with expected output
            if actual_output == request.output.strip():
                return {
                    "status": "Accepted", 
                    "output": actual_output,
                    "real_time_ms": result.get('real_time', 0),
                    "memory_bytes": result.get('memory', 0),
                }
            else:
                return {
                    "status": "Wrong Answer",
                    "expected": request.output.strip(),
                    "actual": actual_output, 
                    "real_time_ms": result.get('real_time', 0),
                    "memory_bytes": result.get('memory', 0),
                }
    

@app.get("/ping")
async def ping():
    return JudgeServer.ping()


@app.post("/judge")
async def judge(request: CodeExecutionRequest):
    return JudgeServer.judge(request)

@app.post("/judge-batch")
async def judge(request: BatchCodeExecutionRequest):
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
            raise JudgeServerException("Unsupported language!")

    seccomp_rule = run_config["seccomp_rule"]    
    submission_id = uuid.uuid4().hex

    with InitSubmissionEnv(JUDGER_WORKSPACE_BASE, submission_id) as tmpdir:
        # Setup source code file
        if compile_config is None:
            src_name = run_config["exe_name"]
            src_path = os.path.join(tmpdir, src_name)
            exe_path = src_path
            
            with open(src_path, "w") as f:
                f.write(request.code)
            
            os.chmod(src_path, 0o755)
        else:
            src_path = os.path.join(tmpdir, compile_config["src_name"])
            exe_path = os.path.join(tmpdir, compile_config["exe_name"])

            with open(src_path, "w") as f:
                f.write(request.code)

            compile_command = compile_config["compile_command"]
            compile_command = compile_command.format(
                src_path=src_path,
                exe_dir=tmpdir,
                exe_path=exe_path
            )

            # Compile
            compile_process = subprocess.run(
                shlex.split(compile_command),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )

            if compile_process.returncode != 0:
                return [{
                    "status": "Compilation Error",
                    "error": compile_process.stderr.decode()
                }]

            if os.path.exists(exe_path):
                os.chmod(exe_path, 0o755)
            else:
                logging.warning(f"Executable {exe_path} not found after compilation")

        results = []
        # Process each test case
        for test_case in request.test_case:
            input_path = os.path.join(tmpdir, "input.txt")
            output_path = os.path.join(tmpdir, "output.txt")
            error_path = os.path.join(tmpdir, "error.txt")
            
            with open(input_path, "w") as f:
                f.write(test_case.input)

            run_command = run_config["command"].format(
                exe_path=exe_path,
                exe_dir=tmpdir,
                max_memory=int(request.memory_limit / 1024),
                src_path=src_path
            )
            run_args = shlex.split(run_command)

            # Execute the program
            result = _judger.run(
                max_cpu_time=request.time_limit,
                max_real_time=request.time_limit,
                max_memory=request.memory_limit,
                max_stack=128 * 1024 * 1024,
                max_output_size=1024 * 1024 * 16,
                max_process_number=_judger.UNLIMITED,
                exe_path=run_args[0],
                input_path=input_path,
                output_path=output_path,
                error_path=error_path,
                args=run_args[1:],
                env=run_config.get("env", []),
                log_path=JUDGER_LOG_PATH,
                seccomp_rule_name=seccomp_rule,
                uid=RUN_USER_UID,
                gid=RUN_GROUP_GID,
                memory_limit_check_only=run_config.get("memory_limit_check_only", 0)
            )

            # Read output
            actual_output = ""
            if os.path.exists(output_path):
                with open(output_path, "r") as f:
                    actual_output = f.read().strip()

            # Check result
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
                
                results.append({
                    "real_time_ms": result.get('real_time', 0),
                    "memory_bytes": result.get('memory', 0),
                    "status": error_reason,
                    "error": error_message
                })

                # If rule is "DEFAULT", stop at first error
                if request.rule == "DEFAULT":
                    return results
                continue

            # Compare output
            if actual_output == test_case.output.strip():
                results.append({
                    "status": "Accepted",
                    "output": actual_output,
                    "real_time_ms": result.get('real_time', 0),
                    "memory_bytes": result.get('memory', 0)
                })
            else:
                results.append({
                    "status": "Wrong Answer",
                    "expected": test_case.output.strip(),
                    "actual": actual_output,
                    "real_time_ms": result.get('real_time', 0),
                    "memory_bytes": result.get('memory', 0)
                })
                # If rule is "DEFAULT", stop at first wrong answer
                if request.rule == "DEFAULT":
                    return results

        return results


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


@app.on_event("startup")
async def startup_event():
    # Check network connectivity first
    def check_network_connectivity():
        """Check if we can reach the Eureka server"""
        eureka_host = os.environ.get('EUREKA_SERVER_URL', 'http://eureka-server:8761/eureka').split('//')[1].split(':')[0]
        
        try:
            # Try to resolve the hostname
            ip = socket.gethostbyname(eureka_host)
            logging.info(f"Eureka server hostname '{eureka_host}' resolves to IP: {ip}")
            
            # Try to connect to the port
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            result = sock.connect_ex((eureka_host, 8761))
            sock.close()
            
            if result == 0:
                logging.info(f"Successfully connected to Eureka server at {eureka_host}:8761")
                return True
            else:
                logging.warning(f"Cannot connect to Eureka server at {eureka_host}:8761")
                return False
                
        except socket.gaierror as e:
            logging.error(f"Cannot resolve Eureka server hostname '{eureka_host}': {e}")
            return False
        except Exception as e:
            logging.error(f"Network connectivity check failed: {e}")
            return False

    # Get container's IP address
    def get_container_ip():
        try:
            # Try to get container IP using hostname first
            ip = socket.gethostbyname(socket.gethostname())
            if ip.startswith("127."):
                # If we got localhost, try getting the non-localhost IP
                s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                s.connect(("8.8.8.8", 80))
                ip = s.getsockname()[0]
                s.close()
            return ip
        except Exception as e:
            logging.warning(f"Failed to get container IP: {e}")
            return os.environ.get('INSTANCE_HOST', 'judger')

    # Check if Eureka is enabled
    eureka_enabled = os.environ.get('EUREKA_ENABLED', 'true').lower() == 'true'
    
    if not eureka_enabled:
        logging.info("Eureka registration is disabled")
        return

    # Check network connectivity first
    logging.info("Checking network connectivity to Eureka server...")
    if not check_network_connectivity():
        logging.warning("Eureka server is not reachable, will retry later...")

    instance_host = get_container_ip()
    logging.info(f"Using instance host: {instance_host}")

    # Get Eureka server URL from environment variable
    eureka_server_url = os.environ.get('EUREKA_SERVER_URL', 'http://eureka-server:8761/eureka')
    logging.info(f"Connecting to Eureka server: {eureka_server_url}")

    # Retry logic for Eureka registration
    max_retries = 5
    retry_delay = 10  # seconds
    
    for attempt in range(max_retries):
        try:
            logging.info(f"Eureka registration attempt {attempt + 1}/{max_retries}")
            
            await eureka_client.init_async(
                eureka_server=eureka_server_url,
                app_name="judger",
                instance_port=8090,
                instance_host=instance_host,
            )
            
            logging.info("Successfully registered with Eureka server")
            break
            
        except Exception as e:
            logging.error(f"Eureka registration attempt {attempt + 1} failed: {e}")
            
            if attempt < max_retries - 1:
                logging.info(f"Retrying in {retry_delay} seconds...")
                await asyncio.sleep(retry_delay)
            else:
                logging.error("All Eureka registration attempts failed. Service will continue without Eureka.")


if DEBUG:
    logging.info("DEBUG=ON")


# uvicorn main:app --host 0.0.0.0 --port 8000 or fastapi dev main.py
if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    app.run(debug=DEBUG)

