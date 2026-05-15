from app.utils.ai import get_chat_completion
from app.models.schema import BillingRecord, SoapNote
from sqlalchemy.orm import Session
import json

async def run_billing_agent(consultation_id: int, db: Session):
    soap = db.query(SoapNote).filter(SoapNote.consultation_id == consultation_id).first()
    if not soap:
        return {"status": "error", "message": "SOAP note not found"}

    prompt = f"""
    Based on the following SOAP note, suggest appropriate ICD-10 and CPT codes for billing.
    Return the result in JSON format.
    
    SOAP Note:
    Subjective: {soap.subjective}
    Objective: {soap.objective}
    Assessment: {soap.assessment}
    Plan: {soap.plan}
    
    JSON format:
    {{
        "icd_codes": [{{ "code": "...", "description": "..." }}],
        "cpt_codes": [{{ "code": "...", "description": "..." }}],
        "estimated_amount": 0.0
    }}
    """
    
    messages = [{"role": "system", "content": "You are a medical billing specialist."}, {"role": "user", "content": prompt}]
    billing_json_str = await get_chat_completion(messages, response_format={"type": "json_object"})
    
    if billing_json_str:
        billing_data = json.loads(billing_json_str)
        
        # Save billing record
        billing_record = BillingRecord(
            appointment_id=soap.consultation.appointment_id,
            patient_id=soap.consultation.appointment.patient_id,
            amount=billing_data.get("estimated_amount", 0.0),
            status="pending",
            codes=billing_data
        )
        db.add(billing_record)
        db.commit()
        
        return {"status": "success", "data": billing_data}
    
    return {"status": "error", "message": "Billing prediction failed"}
