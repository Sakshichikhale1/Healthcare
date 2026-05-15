from app.models.schema import BillingRecord, Appointment, Patient
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

async def run_analytics_agent(db: Session):
    # Calculate some basic KPIs
    total_patients = db.query(Patient).count()
    total_appointments = db.query(Appointment).count()
    
    # Revenue in the last 30 days
    last_month = datetime.now() - timedelta(days=30)
    monthly_revenue = db.query(func.sum(BillingRecord.amount)).filter(BillingRecord.created_at >= last_month).scalar() or 0.0
    
    # AI Tasks completed (placeholder)
    ai_tasks = 48392 # Mocking for now as we don't have a task counter yet
    
    return {
        "status": "success",
        "kpis": {
            "total_patients": total_patients,
            "total_appointments": total_appointments,
            "monthly_revenue": float(monthly_revenue),
            "ai_tasks": ai_tasks
        }
    }
