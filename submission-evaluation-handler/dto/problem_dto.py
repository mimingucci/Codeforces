from pydantic import BaseModel

class Problem(BaseModel):
    id: int
    timeLimit: int
    memoryLimit: int
    score: int