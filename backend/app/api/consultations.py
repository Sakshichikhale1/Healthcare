from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.database.connection import get_db
from app.models.schema import Consultation, SoapNote, Transcript, Appointment, Patient

router = APIRouter()

class SoapNoteSchema(BaseModel):
    subjective: str
    objective: str
    assessment: str
    plan: str
    
class ConsultationResponse(BaseModel):
    id: int
    appointment_id: int
    status: str
    notes: Optional[str]

    class Config:
        from_attributes = True

@router.get("/{consultation_id}/soap", response_model=SoapNoteSchema)
def get_soap_note(consultation_id: int, db: Session = Depends(get_db)):
    soap = db.query(SoapNote).filter(SoapNote.consultation_id == consultation_id).first()
    if not soap:
        raise HTTPException(status_code=404, detail="SOAP note not found")
    return SoapNoteSchema(
        subjective=soap.subjective,
        objective=soap.objective,
        assessment=soap.assessment,
        plan=soap.plan
    )

@router.post("/{consultation_id}/soap", response_model=SoapNoteSchema)
def create_soap_note(consultation_id: int, note: SoapNoteSchema, db: Session = Depends(get_db)):
    db_note = db.query(SoapNote).filter(SoapNote.consultation_id == consultation_id).first()
    if db_note:
        db_note.subjective = note.subjective
        db_note.objective = note.objective
        db_note.assessment = note.assessment
        db_note.plan = note.plan
    else:
        db_note = SoapNote(
            consultation_id=consultation_id,
            subjective=note.subjective,
            objective=note.objective,
            assessment=note.assessment,
            plan=note.plan
        )
        db.add(db_note)
    
    db.commit()
    db.refresh(db_note)
    return note

@router.post("/{consultation_id}/finish")
def finish_consultation(consultation_id: int, db: Session = Depends(get_db)):
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    if not consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    
    consultation.status = "completed"
    db.commit()
    
    # Trigger Billing Agent and Follow-Up Agent
    # ...
    
    return {"message": "Consultation finished, downstream agents triggered"}

@router.get("/{consultation_id}/transcript")
def get_transcript(consultation_id: int, db: Session = Depends(get_db)):
    transcript = db.query(Transcript).filter(Transcript.consultation_id == consultation_id).first()
    if not transcript:
        return {"text": ""}
    return {"text": transcript.text}
