from app.utils.ai import get_chat_completion
from app.models.schema import Patient, Consultation
from sqlalchemy.orm import Session
import json

async def run_clinical_intelligence_agent(patient_id: int, consultation_id: int, db: Session):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    consultation = db.query(Consultation).filter(Consultation.id == consultation_id).first()
    
    if not patient or not consultation:
        return {"status": "error", "message": "Patient or consultation not found"}

    prompt = f"""
    You are a clinical intelligence agent. Analyze the following patient data and consultation notes for potential risks, drug interactions, and clinical insights.
    
    Patient Medical History:
    {json.dumps(patient.medical_history)}
    
    Consultation Notes:
    {consultation.notes}
    
    JSON format:
    {{
        "risks": [{{ "level": "high|medium|low", "description": "..." }}],
        "interactions": [{{ "drugs": ["...", "..."], "severity": "...", "note": "..." }}],
        "insights": ["...", "..."]
    }}
    """
    
    messages = [{"role": "system", "content": "You are a clinical decision support system."}, {"role": "user", "content": prompt}]
    intelligence_json_str = await get_chat_completion(messages, response_format={"type": "json_object"})
    
    if intelligence_json_str:
        intelligence_data = json.loads(intelligence_json_str)
        return {"status": "success", "data": intelligence_data}
    
    return {"status": "error", "message": "Clinical analysis failed"}
