from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from leaderboard.service import LeaderboardService
from leaderboard.model import LeaderboardEntry

# Initialize router
router = APIRouter(prefix="/api/v1/leaderboard", tags=["leaderboard"])

# Get singleton instance
leaderboard_service = LeaderboardService.get_instance()


@router.get("/contest/{contest_id}", response_model=List[LeaderboardEntry])
async def get_contest_leaderboard(
        contest_id: int
):
    """Get the leaderboard for a specific contest"""
    return leaderboard_service.get_leaderboard(contest_id)


@router.get("/contest/{contest_id}/user/{user_id}", response_model=List[LeaderboardEntry])
async def get_user_contest_stats(
        contest_id: int,
        user_id: int
):
    """Get detailed statistics for a user in a contest"""
    return leaderboard_service.get_leaderboard(user_id, contest_id)

@router.post("/contest/{contest_id}/started")
async def start_contest(contest_id: int):
    """Trigger when start contest"""
    leaderboard_service.start_contest()