from typing import Dict, List, Tuple, Optional, Set
from event import SubmissionJudgedEvent
from datetime import datetime, timedelta
from judge_status import Verdict
from leaderboard.model import LeaderboardEntry
# from leaderboard.repository import EventRepository
import copy
import os


class LeaderboardService:
    # Singleton instance
    _instance = None

    @classmethod
    def get_instance(cls):
        """Get the singleton instance of LeaderboardService"""
        if cls._instance is None:
            # Get database config from environment or default values
            db_host = os.getenv("DB_HOST", "localhost")
            db_user = os.getenv("DB_USER", "root")
            db_password = os.getenv("DB_PASSWORD", "Andrew1122:))")
            db_name = os.getenv("DB_NAME", "codeforces")

            cls._instance = LeaderboardService(db_host, db_user, db_password, db_name)
        return cls._instance

    def __init__(self, db_host="localhost", db_user="root", db_password="Andrew1122:))", db_name="codeforces"):
        """Initialize the leaderboard service with database connection"""
        # In-memory data structures
        self.contest_standings: Dict[int, Dict[int, Dict]] = {}

        # Cache of submissions by contest for quick access
        self.submission_cache: Dict[int, List[SubmissionJudgedEvent]] = {}

        # Set of active contests we've seen
        self.active_contests: Set[int] = set()

        self.contests_metadata: Dict[int, datetime] = {}

        # Database repository for events
        # self.repository = EventRepository(db_host, db_user, db_password, db_name)

    # def _load_data_from_db(self):
    #     """Load initial event data from database"""
    #     try:
    #         # Get all contests that have events
    #         contest_ids = self.repository.get_all_contests()
    #
    #         for contest_id in contest_ids:
    #             self.active_contests.add(contest_id)
    #
    #             # Load events for this contest
    #             self._load_contest_events(contest_id)
    #
    #         print(f"Loaded data for {len(self.active_contests)} contests")
    #     except Exception as e:
    #         print(f"Error loading data from database: {e}")
    #
    # def _load_contest_events(self, contest_id: int):
    #     """Load all events for a specific contest and rebuild standings"""
    #     # Get events from DB
    #     raw_events = self.repository.get_events_by_contest(contest_id)
    #
    #     # Convert to SubmissionJudgedEvent objects
    #     events = []
    #     for event_data in raw_events:
    #         try:
    #             event = SubmissionJudgedEvent(
    #                 id=event_data["submission_id"],
    #                 author=event_data["author_id"],
    #                 contest=event_data["contest_id"],
    #                 problem=event_data["problem_id"],
    #                 verdict=Verdict(event_data["verdict"]),
    #                 execution_time_ms=event_data["execution_time_ms"],
    #                 memory_used_kb=event_data["memory_used_kb"],
    #                 score=event_data["score"],
    #                 judged_on=event_data["judged_on"]
    #             )
    #             events.append(event)
    #         except Exception as e:
    #             print(f"Error converting event data: {e}")
    #
    #     # Cache the events
    #     self.submission_cache[contest_id] = events
    #
    #     # Reset standings for this contest
    #     self.contest_standings[contest_id] = {}
    #
    #     # Process each event to rebuild standings
    #     for event in events:
    #         self.process_submission_event(event, skip_save=True)

    def process_submission_event(self, event: SubmissionJudgedEvent):
        """Process a new submission verdict event and update the leaderboard"""
        contest_id = event.contest
        user_id = event.author
        problem_id = event.id

        # Add to active contests
        if contest_id not in self.active_contests:
            return

        # Initialize contest standings if needed
        if contest_id not in self.contest_standings:
            self.contest_standings[contest_id] = {}

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

                contest_start_time = self.contests_metadata[contest_id]

                # Calculate solve time (in minutes from contest start)
                solve_time = (event.judged_on - contest_start_time).total_seconds() // 60
                user_standing["problem_solve_times"][problem_id] = int(solve_time)

                # Update score
                if event.score is not None:
                    score = event.score
                else:
                    score = 1  # Default score for binary scoring

                user_standing["total_score"] += score

                # Add penalty: solve time + 10 minutes per wrong attempt (example penalty rule)
                wrong_attempts = user_standing["problem_attempts"][problem_id]
                penalty = int(solve_time) + (wrong_attempts * 10)
                user_standing["penalty"] += penalty
            else:
                # Increment wrong attempt counter for non-accepted verdicts
                user_standing["problem_attempts"][problem_id] += 1

        # Recalculate ranks after processing
        self._recalculate_ranks(contest_id)

    def start_contest(self, contest_id: int):
        self.active_contests.add(contest_id)
        self.contests_metadata[contest_id] = datetime.now()
        self.contest_standings[contest_id] = {}

    def end_contest(self, contest_id: int):
        self.active_contests.discard(contest_id)
        self.contests_metadata.pop(contest_id)


    # def replay_submissions_for_virtual_contest(self, user_id: int, contest_id: int):
    #     """
    #     Replay all submissions for a contest up to the current virtual contest time
    #     This simulates what would have happened in the real contest time
    #     """
    #     # Make sure we have events loaded
    #     if contest_id not in self.submission_cache:
    #         self._load_contest_events(contest_id)
    #
    #     # Make sure user is registered for virtual contest
    #     virtual_start, virtual_end_time = self.virtual_contests.get((user_id, contest_id))
    #     if not virtual_start:
    #         return  # No virtual contest started
    #
    #     # If no end time specified, replay all submissions
    #     if virtual_end_time is None:
    #         virtual_end_time = datetime.now()
    #
    #     # Get the earliest event timestamp as contest start time
    #     if not self.submission_cache[contest_id]:
    #         return  # No events to replay
    #
    #     real_contest_start = min(e.judged_on for e in self.submission_cache[contest_id])
    #
    #     # Calculate how much virtual contest time has elapsed
    #     virtual_elapsed = (virtual_end_time - virtual_start).total_seconds()
    #
    #     # Process each submission that would have occurred within this time window
    #     for event in self.submission_cache[contest_id]:
    #         # Calculate when this event happened in real contest time
    #         real_elapsed = (event.judged_on - real_contest_start).total_seconds()
    #
    #         # Only process if the event would have happened by now in virtual time
    #         if real_elapsed <= virtual_elapsed:
    #             # Create a copy of the event with adjusted timestamp for virtual time
    #             virtual_event = copy.deepcopy(event)
    #             virtual_event.judged_on = virtual_start + timedelta(seconds=real_elapsed)
    #
    #             # Process this event as a virtual submission
    #             self.process_submission_event(virtual_event, is_virtual=True)

    def get_leaderboard(self, contest_id: int,
                        user_id: Optional[int] = None) -> List[LeaderboardEntry]:
        """Get the current leaderboard for a contest"""
        if contest_id not in self.active_contests:
            return []

        # Convert standings dictionary to list of LeaderboardEntry objects
        entries = []
        for uid, standing in self.contest_standings[contest_id].items():
            if user_id is not None and uid != user_id:
                continue

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

        # Sort by rank (ascending)
        entries.sort(key=lambda e: e.rank)

        return entries

    def _recalculate_ranks(self, contest_id):
        """
        Recalculate participant ranks for a specific contest.
        Ranks are determined by:
        1. Higher total score
        2. Lower penalty time (for tie-breaking)
        """
        if contest_id not in self.active_contests:
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

            self.contest_standings[contest_id][user_id] = standing

    # def get_user_statistics(self, user_id: int, contest_id: int) -> Dict:
    #     """Get detailed statistics for a user in a contest"""
    #     # Make sure contest is loaded
    #     if contest_id not in self.contest_standings:
    #         if contest_id in self.active_contests:
    #             self._load_contest_events(contest_id)
    #         else:
    #             return {
    #                 "total_score": 0,
    #                 "penalty": 0,
    #                 "rank": 0,
    #                 "solved_count": 0,
    #                 "problems": []
    #             }
    #
    #     if user_id not in self.contest_standings[contest_id]:
    #         return {
    #             "total_score": 0,
    #             "penalty": 0,
    #             "rank": 0,
    #             "solved_count": 0,
    #             "problems": []
    #         }
    #
    #     user_standing = self.contest_standings[contest_id][user_id]
    #
    #     # Calculate additional statistics
    #     problem_stats = []
    #     for problem_id in user_standing["problem_attempts"].keys():
    #         solved = problem_id in user_standing["solved_problems"]
    #         attempts = user_standing["problem_attempts"].get(problem_id, 0)
    #         solve_time = user_standing["problem_solve_times"].get(problem_id, 0) if solved else 0
    #
    #         problem_stats.append({
    #             "problem_id": problem_id,
    #             "solved": solved,
    #             "attempts": attempts,
    #             "solve_time_minutes": solve_time if solved else 0
    #         })
    #
    #     return {
    #         "total_score": user_standing["total_score"],
    #         "penalty": user_standing["penalty"],
    #         "rank": user_standing.get("rank", 0),
    #         "solved_count": len(user_standing["solved_problems"]),
    #         "problems": problem_stats
    #     }



