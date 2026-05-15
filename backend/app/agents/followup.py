from app.models.schema import FollowUp, Consultation
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

async def run_followup_agent(consultation_id: int, db: Session):
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        return {"status": "error", "message": "Consultation not found"}

    # Logic to determine follow-up date (e.g., 4 weeks later)
    followup_date = datetime.now() + timedelta(weeks=4)
    
    new_followup = FollowUp(
        patient_id=consultation.appointment.patient_id,
        consultation_id=consultation_id,
        scheduled_date=followup_date,
        status="pending",
        notes="Automated follow-up scheduled by Follow-Up Agent."
    )
    db.add(new_followup)
    db.commit()
    
    return {"status": "success", "scheduled_date": followup_date.isoformat()}
