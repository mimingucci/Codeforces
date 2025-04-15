from pydantic import BaseModel
from judge_status import Verdict
from typing import Optional
from datetime import datetime
from judge import Language, Rule

class JudgeSubmissionEvent(BaseModel):
    id: int
    problem: int
    sourceCode: str
    contest: int
    author: int
    score: int
    timeLimit: int
    memoryLimit: int
    language: Language
    rule: Rule = Rule.DEFAULT

class SubmissionJudgedEvent(BaseModel):
    id: int
    verdict: Verdict
    author: int
    contest: int
    problem: int
    execution_time_ms: Optional[int] = None
    memory_used_kb: Optional[int] = None
    score: Optional[int] = None
    judged_on: datetime

class VirtualContestStartEvent(BaseModel):
    user_id: int
    contest_id: int
    virtual_start_time: datetime
    real_contest_start_time: datetime