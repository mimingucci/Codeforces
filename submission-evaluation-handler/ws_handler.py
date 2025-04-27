from fastapi import WebSocket
from typing import Dict, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SubmissionNotifier:
    def __init__(self):
        self.subscribers: Dict[str, set[WebSocket]] = {}

    async def subscribe(self, submission_id: str, websocket: WebSocket):
        """Add a subscriber for a specific submission."""
        if submission_id not in self.subscribers:
            self.subscribers[submission_id] = set()
        self.subscribers[submission_id].add(websocket)
        logger.info(f"New subscriber added for submission {submission_id}")

    async def unsubscribe(self, submission_id: str, websocket: WebSocket):
        """Remove a subscriber for a specific submission."""
        if submission_id in self.subscribers:
            self.subscribers[submission_id].discard(websocket)
            if not self.subscribers[submission_id]:
                del self.subscribers[submission_id]
        logger.info(f"Subscriber removed from submission {submission_id}")

    async def notify_subscribers(self, submission_id: str, message: dict):
        """Notify all subscribers of a submission about updates."""
        if submission_id in self.subscribers:
            dead_connections = set()
            for websocket in self.subscribers[submission_id]:
                try:
                    await websocket.send_json(message)
                except Exception as e:
                    logger.error(f"Failed to send message to subscriber: {e}")
                    dead_connections.add(websocket)
            
            # Clean up dead connections
            for dead_ws in dead_connections:
                await self.unsubscribe(submission_id, dead_ws)

    async def close_all_connections(self, submission_id: str):
        """Close all WebSocket connections for a specific submission."""
        if submission_id in self.subscribers:
            for websocket in self.subscribers[submission_id].copy():
                try:
                    await websocket.close()
                except Exception as e:
                    logger.error(f"Error closing websocket: {e}")
                finally:
                    await self.unsubscribe(submission_id, websocket)

# Create global notifier instance
notifier = SubmissionNotifier()

async def notify_test_case_status(submission_id: str, test_number: int):
    """Send test case status update to all subscribers."""
    message = {
        "type": "test_case_update",
        "submission_id": submission_id,
        "test_number": test_number
    }
    
    await notifier.notify_subscribers(submission_id, message)

async def notify_completion(submission_id: str, status: str, execution_time_ms: int | None, memory_used_bytes: int | None):
    """Send completion status to all subscribers."""
    message = {
        "type": "test_case_completion",
        "submission_id": submission_id,
        "status": status, 
        "execution_time_ms": execution_time_ms, 
        "memory_used_bytes": memory_used_bytes
    }
    try:
        await notifier.notify_subscribers(submission_id, message)
    finally:
        # Always close connections after completion
        await notifier.close_all_connections(submission_id)
