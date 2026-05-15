from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.agents.analytics import run_analytics_agent

router = APIRouter()

@router.get("/kpis")
async def get_kpis(db: Session = Depends(get_db)):
    data = await run_analytics_agent(db)
    return data
