import json
from multiprocessing import Pool
import psutil
from circuitbreaker import circuit
import httpx
import py_eureka_client.eureka_client as eureka_client
from fastapi import HTTPException
from enum import Enum
from pydantic import BaseModel

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

@circuit(failure_threshold=3, recovery_timeout=10)
async def judge(payload: CodeExecutionRequest):
    try:
        response = await eureka_client.do_service_async(app_name="judger", service="/judge", method="POST", data=json.dumps(payload))
        return response
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=f"Error from testcase service: {e.response.text}")
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Service unreachable: {str(e)}")


def _run(instance, input_data: str, output_data: str):
    return instance._judge_one(input_data, output_data)

class Judge(object):
    def __init__(self, src: str, inputs: list[str], outputs: list[str], time_limit: int = 2000, memory_limit: int = 512000000, language: Language = Language.C) -> None:
        self.src = src
        self.inputs = inputs
        self.outputs = outputs
        self.time_limit = time_limit
        self.memory_limit = memory_limit
        self.language = language
    
    def _judge_one(self, input_date: str, output_date: str):
        return judge(CodeExecutionRequest(
            code=self.src,
            input=input_date,
            output=output_date,
            time_limit=self.time_limit,
            memory_limit=self.memory_limit,
            language=self.language
        ))

    def run(self):
        tmp_result = []
        result = []
        pool = Pool(processes=psutil.cpu_count())
        try:
            for test_case_id in range(len(self.inputs)):
                tmp_result.append(pool.apply_async(_run, (self, self.inputs[test_case_id], self.outputs[test_case_id])))
        except Exception as e:
            raise e
        finally:
            pool.close()
            pool.join()
        for item in tmp_result:
            # exception will be raised, when get() is called
            # http://stackoverflow.com/questions/22094852/how-to-catch-exceptions-in-workers-in-multiprocessing
            result.append(item.get())
        print(result)
        return result