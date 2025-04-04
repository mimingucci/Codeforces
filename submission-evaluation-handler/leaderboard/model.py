from pydantic import BaseModel
from typing import List, Dict

class LeaderboardEntry(BaseModel):
    user_id: int
    rank: int
    total_score: int
    penalty: int  # Time penalty in minutes
    solved_problems: List[int]
    problem_attempts: Dict[int, int]  # Problem ID -> number of attempts
    problem_solve_times: Dict[int, int]  # Problem ID -> time to solve in minutes