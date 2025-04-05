import pymysql
from pymysql.cursors import DictCursor
from typing import List, Dict, Any
from event import SubmissionJudgedEvent
from judge_status import Verdict
from datetime import datetime


class EventRepository:
    """Repository that only stores submission judged events"""

    def __init__(self, host="localhost", user="root", password="Andrew1122:))", database="codeforces"):
        self.connection_params = {
            "host": host,
            "user": user,
            "password": password,
            "database": database,
            "cursorclass": DictCursor
        }
        self._create_tables_if_not_exist()

    def _create_tables_if_not_exist(self):
        """Initialize database schema if needed"""
        with pymysql.connect(**self.connection_params) as connection:
            with connection.cursor() as cursor:
                # Create simple event store table for submission events
                cursor.execute("""
                CREATE TABLE IF NOT EXISTS submission_events (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    submission_id INT NOT NULL,
                    author_id INT NOT NULL,
                    contest_id INT NOT NULL,
                    problem_id INT NOT NULL,
                    verdict VARCHAR(30) NOT NULL,
                    execution_time_ms INT,
                    memory_used_kb INT,
                    score INT,
                    judged_on DATETIME NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_contest (contest_id),
                    INDEX idx_judged_on (judged_on)
                ) ENGINE=InnoDB;
                """)

                connection.commit()

    def save_event(self, event: SubmissionJudgedEvent) -> bool:
        """Store a submission event in the database"""
        try:
            with pymysql.connect(**self.connection_params) as connection:
                with connection.cursor() as cursor:
                    sql = """
                    INSERT INTO submission_events 
                    (submission_id, author_id, contest_id, problem_id, verdict, 
                     execution_time_ms, memory_used_kb, score, judged_on)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """
                    cursor.execute(sql, (
                        event.id,
                        event.author,
                        event.contest,
                        event.problem,  # Using id as problem_id as per your model
                        event.verdict.value,
                        event.execution_time_ms,
                        event.memory_used_kb,
                        event.score,
                        event.judged_on
                    ))
                    connection.commit()
                    return True
        except Exception as e:
            print(f"Error saving submission event: {e}")
            return False

    def get_events_by_contest(self, contest_id: int) -> List[Dict[str, Any]]:
        """Retrieve all submission events for a contest in chronological order"""
        try:
            with pymysql.connect(**self.connection_params) as connection:
                with connection.cursor() as cursor:
                    sql = """
                    SELECT * FROM submission_events 
                    WHERE contest_id = %s 
                    ORDER BY judged_on ASC
                    """
                    cursor.execute(sql, (contest_id,))
                    results = cursor.fetchall()
                    return results
        except Exception as e:
            print(f"Error fetching contest events: {e}")
            return []

    def get_all_contests(self) -> List[int]:
        """Get a list of all contest IDs that have events"""
        try:
            with pymysql.connect(**self.connection_params) as connection:
                with connection.cursor() as cursor:
                    sql = "SELECT DISTINCT contest_id FROM submission_events"
                    cursor.execute(sql)
                    results = cursor.fetchall()
                    return [row["contest_id"] for row in results]
        except Exception as e:
            print(f"Error fetching contest list: {e}")
            return []