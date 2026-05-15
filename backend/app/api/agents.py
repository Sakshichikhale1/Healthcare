from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.connection import get_db
from app.models.schema import AgentLog
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class AgentLogResponse(BaseModel):
    id: int
    agent_name: str
    action: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/logs", response_model=List[AgentLogResponse])
def get_agent_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(AgentLog).order_by(AgentLog.created_at.desc()).limit(limit).all()
    return logs

@router.get("/status")
def get_agent_status():
    # Placeholder for actual supervisor status
    return {
        "intake": {"status": "active", "task": "Waiting for new patients"},
        "scribe": {"status": "idle", "task": "Ready for transcription"},
        "billing": {"status": "active", "task": "Processing daily claims"},
        "followup": {"status": "active", "task": "Sending reminders"},
        "clinical": {"status": "idle", "task": "Ready for analysis"},
        "analytics": {"status": "active", "task": "Aggregating metrics"}
    }
