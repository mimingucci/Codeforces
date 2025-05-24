import _judger
import hashlib
import os
import socket
import psutil
from exception import JudgeServerException

def server_info():
    ver = _judger.VERSION
    return {"hostname": socket.gethostname(),
            "cpu": psutil.cpu_percent(),
            "cpu_core": psutil.cpu_count(),
            "memory": psutil.virtual_memory().percent,
            "judger_version": ".".join([str((ver >> 16) & 0xff), str((ver >> 8) & 0xff), str(ver & 0xff)])}


def get_hash_token():
    token = os.environ.get("TOKEN")
    if token:
        token = hashlib.sha256(token.encode("utf-8")).hexdigest()
        return token
    else:
        raise JudgeServerException("env 'TOKEN' not found")


class ProblemIOMode:
    standard = "Standard IO"
    file = "File IO"


