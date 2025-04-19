import json
from enum import Enum
from pydantic import BaseModel
from service.service_client import ServiceClient

class Language(Enum):
    C = "C"
    CPP = "Cpp"
    PY3 = "Python3"
    JS = "Javascript"
    JAVA = "Java"
    PHP = "Php"
    GO = "Golang"

class Rule(Enum):
    DEFAULT = "DEFAULT"
    ICPC = "ICPC"

class Verdict(Enum):
    ACCEPT = "ACCEPT",
    WRONG_ANSWER = "WRONG_ANSWER",
    TIME_LIMIT_EXCEED = "TIME_LIMIT_EXCEED",
    MEMORY_LIMIT_EXCEED = "MEMORY_LIMIT_EXCEED",
    RUNTIME_ERROR = "RUNTIME_ERROR",
    COMPILE_ERROR = "COMPILE_ERROR"

# Request model
class CodeExecutionRequest(BaseModel):
    code: str  # C++ source code as a string
    input: str  # Input for the program
    output: str  # Expected output
    time_limit: int
    memory_limit: int
    language: Language

class Judge(object):
    def __init__(self, src: str, inputs: list[str], outputs: list[str], time_limit: int = 2000, memory_limit: int = 512000000, language: Language = Language.C, rule: Rule = Rule.DEFAULT) -> None:
        self.src = src
        self.inputs = inputs
        self.outputs = outputs
        self.time_limit = time_limit
        self.memory_limit = memory_limit
        self.language = language
        self.rule = rule
    
    async def _judge_one(self, input_date: str, output_date: str):
        response = await ServiceClient.post(json_data={
            "code": self.src,
            "input": input_date,
            "output": output_date,
            "time_limit": self.time_limit,
            "memory_limit": self.memory_limit,
            "language": self.language.value
        },
        service_name="judger",
        endpoint="judge",
        headers={
            "X-Judge-Server-Token": "6c3d42616001c43de92e516b0175ccff4c62c83c9ea02e8f022e2ee7e299c53b",
            "Content-Type": "application/json"
        }
        )

        # Convert string response to dictionary
        if isinstance(response, str):
            response = json.loads(response)

        return response

    async def run(self):
        results = []
        for i in range(len(self.inputs)):
            result = await self._judge_one(input_date=self.inputs[i], output_date=self.outputs[i])
            results.append(result)
            if isinstance(result, dict) and result.get('status') != 'Accepted' and self.rule == Rule.DEFAULT:
                return results
        return results