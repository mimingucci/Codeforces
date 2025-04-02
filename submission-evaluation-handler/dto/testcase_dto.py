from pydantic import BaseModel

class Testcase(BaseModel):
    input: str
    output: str

