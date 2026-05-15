import pdfplumber
from app.utils.ai import get_chat_completion
from app.models.schema import Patient, UploadedReport
from sqlalchemy.orm import Session
import json

async def extract_text_from_pdf(file_path: str):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

async def run_intake_agent(patient_id: int, report_id: int, db: Session):
    report = db.query(UploadedReport).filter(UploadedReport.id == report_id).first()
    if not report:
        return {"status": "error", "message": "Report not found"}

    # 1. Extract text
    text = await extract_text_from_pdf(report.file_url)
    
    # 2. Extract medical info using AI
    prompt = f"""
    Extract medical history, allergies, and current medications from the following clinical report.
    Return the result in JSON format.
    
    Report:
    {text}
    
    JSON format:
    {{
        "medical_history": {{ ... }},
        "allergies": [ ... ],
        "medications": [ ... ],
        "summary": "..."
    }}
    """
    
    messages = [{"role": "system", "content": "You are a clinical intake assistant."}, {"role": "user", "content": prompt}]
    extracted_json_str = await get_chat_completion(messages, response_format={"type": "json_object"})
    
    if extracted_json_str:
        extracted_data = json.loads(extracted_json_str)
        
        # Update patient record
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if patient:
            patient.medical_history = extracted_data
            db.commit()
            
        # Update report with extracted data
        report.extracted_data = extracted_data
        db.commit()
        
        return {"status": "success", "data": extracted_data}
    
    return {"status": "error", "message": "Extraction failed"}
