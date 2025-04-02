from pydantic import BaseModel
from datetime import datetime

class Contest(BaseModel):
    id: int
    startTime: datetime
    endTime: datetime