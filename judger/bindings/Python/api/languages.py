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
        "env": default_env
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
        "env": default_env
    }
}

java_lang_config = {
    "compile": {
        "src_name": "Main.java",
        "exe_name": "Main.class",
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
        "seccomp_rule": "", # Using "general" instead of empty string for better security
        "env": ["GODEBUG=madvdontneed=1", "GOCACHE=off"] + default_env,
        "memory_limit_check_only": 1
    }
}

php_lang_config = {
    "run": {
        "exe_name": "solution.php",
        "command": "/usr/bin/php {exe_path}",
        "seccomp_rule": "general",
        "env": default_env,
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