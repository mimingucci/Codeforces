from pydantic import BaseModel
from judge_status import Verdict

class JudgeSubmissionEvent(BaseModel):
    id: int
    problem: int
    sourceCode: str

class SubmissionJudgedEvent(BaseModel):
    id: int
    verdict: Verdict
