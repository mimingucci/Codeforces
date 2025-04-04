from typing import Dict, List, Tuple, Optional
from event import SubmissionJudgedEvent
from datetime import datetime, timedelta
from judge_status import Verdict
from model import LeaderboardEntry
import copy

class LeaderboardService:
    def __init__(self):
        # Contest ID -> Dictionary of user standings
        self.contest_standings: Dict[int, Dict[int, Dict]] = {}
        
        # Virtual contest data: (user_id, contest_id) -> virtual start time
        self.virtual_contests: Dict[Tuple[int, int], datetime] = {}
        
        # Submission history for virtual contests: contest_id -> list of submissions in chronological order
        self.submission_history: Dict[int, List[SubmissionJudgedEvent]] = {}

        # Contest ID -> real start time - real end time
        self.contest_metadata: Dict[int, Tuple[datetime, datetime]] = {}
    
    def process_submission_event(self, event: SubmissionJudgedEvent, is_virtual: bool = False):
        """Process a new submission verdict event and update the leaderboard"""
        contest_id = event.contest
        user_id = event.author
        problem_id = event.id
        
        # Initialize contest standings if needed
        if contest_id not in self.contest_standings:
            self.contest_standings[contest_id] = {}
            
        # Store event in submission history for future virtual contests
        if not is_virtual:
            if contest_id not in self.submission_history:
                self.submission_history[contest_id] = []
            self.submission_history[contest_id].append(event)
            # Sort by timestamp to ensure chronological order
            self.submission_history[contest_id].sort(key=lambda e: e.judged_on)
        
        # Initialize user standing if needed
        if user_id not in self.contest_standings[contest_id]:
            self.contest_standings[contest_id][user_id] = {
                "total_score": 0,
                "penalty": 0,
                "solved_problems": [],
                "problem_attempts": {},
                "problem_solve_times": {},
            }
        
        user_standing = self.contest_standings[contest_id][user_id]
        
        # Only update if problem not already solved by user
        if problem_id not in user_standing["solved_problems"]:
            # Initialize problem attempts counter if needed
            if problem_id not in user_standing["problem_attempts"]:
                user_standing["problem_attempts"][problem_id] = 0
            
            # Update standing based on verdict
            if event.verdict == Verdict.AC:
                user_standing["solved_problems"].append(problem_id)
                
                # Calculate solve time (in minutes from contest start)
                contest_start_time = self._get_contest_start_time(contest_id)
                
                if is_virtual:
                    # For virtual contests, adjust time based on virtual start
                    virtual_start = self.virtual_contests.get((user_id, contest_id))
                    if virtual_start:
                        # Calculate time since virtual start
                        solve_time = (event.judged_on - virtual_start).total_seconds() // 60
                else:
                    # For real contests, use time since actual contest start
                    solve_time = (event.judged_on - contest_start_time).total_seconds() // 60
                
                user_standing["problem_solve_times"][problem_id] = solve_time
                
                # Update score
                if event.score is not None:
                    score = event.score
                else:
                    score = 1  # Default score for binary scoring
                
                user_standing["total_score"] += score
                
                # Add penalty: solve time + 20 minutes per wrong attempt (example penalty rule)
                wrong_attempts = user_standing["problem_attempts"][problem_id]
                penalty = int(solve_time) + (wrong_attempts * 20)
                user_standing["penalty"] += penalty
            else:
                # Increment wrong attempt counter for non-accepted verdicts
                user_standing["problem_attempts"][problem_id] += 1
        
        # Recalculate ranks after processing
        self._recalculate_ranks(contest_id)
    
    def start_virtual_contest(self, user_id: int, contest_id: int, virtual_start_time: datetime):
        """Start a virtual contest for a user"""
        # Record virtual start time
        self.virtual_contests[(user_id, contest_id)] = virtual_start_time
        
        # Remove any existing standings for this user in this contest
        if contest_id in self.contest_standings and user_id in self.contest_standings[contest_id]:
            del self.contest_standings[contest_id][user_id]
    
    def replay_submissions_for_virtual_contest(self, user_id: int, contest_id: int, 
                                              virtual_end_time: Optional[datetime] = None):
        """
        Replay all submissions for a contest up to the current virtual contest time
        This simulates what would have happened in the real contest time
        """
        if contest_id not in self.submission_history:
            return  # No submissions to replay
        
        virtual_start = self.virtual_contests.get((user_id, contest_id))
        if not virtual_start:
            return  # No virtual contest started
        
        real_contest_start = self._get_contest_start_time(contest_id)
        
        # If no end time specified, replay all submissions
        if virtual_end_time is None:
            virtual_end_time = datetime.now()
        
        # Calculate how much virtual contest time has elapsed
        virtual_elapsed = (virtual_end_time - virtual_start).total_seconds()
        
        # Process each submission that would have occurred within this time window
        for event in self.submission_history[contest_id]:
            # Calculate when this event happened in real contest time
            real_elapsed = (event.timestamp - real_contest_start).total_seconds()
            
            # Only process if the event would have happened by now in virtual time
            if real_elapsed <= virtual_elapsed:
                # Create a copy of the event with adjusted timestamp for virtual time
                virtual_event = copy.deepcopy(event)
                virtual_event.timestamp = virtual_start + timedelta(seconds=real_elapsed)
                
                # Process this event as a virtual submission
                self.process_submission_event(virtual_event, is_virtual=True)
    
    def get_leaderboard(self, contest_id: int, limit: int = 100, 
                       user_id: Optional[int] = None) -> List[LeaderboardEntry]:
        """Get the current leaderboard for a contest"""
        if contest_id not in self.contest_standings:
            return []
            
        # Convert standings dictionary to list of LeaderboardEntry objects
        entries = []
        for uid, standing in self.contest_standings[contest_id].items():
            entry = LeaderboardEntry(
                user_id=uid,
                rank=standing.get("rank", 0),
                total_score=standing["total_score"],
                penalty=standing["penalty"],
                solved_problems=standing["solved_problems"],
                problem_attempts=standing["problem_attempts"],
                problem_solve_times=standing["problem_solve_times"]
            )
            entries.append(entry)
        
        # Sort by score (descending) and penalty (ascending)
        entries.sort(key=lambda e: (-e.total_score, e.penalty))
        
        # If user_id is provided, return only that user's standing
        if user_id is not None:
            for entry in entries:
                if entry.user_id == user_id:
                    return [entry]
        else:
            return entries

    def _recalculate_ranks(self, contest_id):
        """
        Recalculate participant ranks for a specific contest.
        Ranks are determined by:
        1. Higher total score
        2. Lower penalty time (for tie-breaking)
        """
        if contest_id not in self.contest_standings:
            return

        # Get all participants for this contest
        participants = list(self.contest_standings[contest_id].items())

        # Sort participants by score (descending) and penalty (ascending)
        sorted_participants = sorted(
            participants,
            key=lambda x: (-x[1]["total_score"], x[1]["penalty"])
        )

        # Assign ranks
        current_rank = 1
        prev_score = None
        prev_penalty = None

        for i, (user_id, standing) in enumerate(sorted_participants):
            # Handle ties (same score and penalty)
            if (prev_score is not None and
                    prev_score == standing["total_score"] and
                    prev_penalty == standing["penalty"]):
                # Same rank as previous participant
                rank = current_rank
            else:
                # New rank (equal to position + 1)
                rank = i + 1
                current_rank = rank

            # Store the rank in participant's standing
            standing["rank"] = rank

            # Remember current score and penalty for next iteration
            prev_score = standing["total_score"]
            prev_penalty = standing["penalty"]

        for uid, standing in sorted_participants:
            self.contest_standings[contest_id][uid] = standing

    def _get_contest_start_time(self, contest_id):
        if contest_id not in self.contest_metadata:
            return datetime.max
        else:
            return self.contest_metadata[contest_id][0]

    def start_contest(self, contest_id: int, start_time: datetime, end_time: datetime):
        self.contest_metadata[contest_id] = (start_time, end_time)
        self.contest_standings[contest_id] = {}
        self.submission_history[contest_id] = []



