import os
import shutil
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from uuid import uuid4
import json

from app.database.connection import get_db
from app.models.schema import UploadedReport, Transcript, Consultation
from app.services.pdf_service import extract_text_from_pdf
from app.services.ai_service import summarize_text, transcribe_audio

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def process_report_task(report_id: int, file_path: str, db: Session):
    """Background task to extract text and summarize medical report."""
    text = extract_text_from_pdf(file_path)
    if text:
        summary_json = await summarize_text(text)
        if summary_json:
            try:
                summary_data = json.loads(summary_json)
                report = db.query(UploadedReport).filter(UploadedReport.id == report_id).first()
                if report:
                    report.extracted_data = {
                        "raw_text": text[:5000], # Store partial text for demo
                        "summary": summary_data
                    }
                    db.commit()
            except Exception as e:
                print(f"Error parsing summary JSON: {e}")

@router.post("/reports")
async def upload_report(
    patient_id: int,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Secure filename and store
    ext = file.filename.split('.')[-1]
    unique_filename = f"{uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
    
    # Save to db
    new_report = UploadedReport(
        patient_id=patient_id,
        file_name=file.filename,
        file_url=file_path,
        file_type=file.content_type
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    # Trigger extraction pipeline in background
    background_tasks.add_task(process_report_task, new_report.id, file_path, db)
    
    return {"message": "Report uploaded successfully", "report_id": new_report.id}

async def process_audio_task(transcript_id: int, file_path: str, db: Session):
    """Background task to transcribe audio and generate SOAP notes."""
    text = await transcribe_audio(file_path)
    if text:
        transcript = db.query(Transcript).filter(Transcript.id == transcript_id).first()
        if transcript:
            transcript.text = text
            db.commit()
            
            # Generate SOAP note (simulated for now, could use GPT-4o)
            # generate_soap_notes(text)

@router.post("/audio")
async def upload_audio(
    consultation_id: int,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # For Whisper transcription
    if not file.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="Invalid file type. Must be audio.")

    ext = file.filename.split('.')[-1]
    unique_filename = f"audio_{uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save audio: {str(e)}")

    # Add transcript placeholder
    transcript = Transcript(
        consultation_id=consultation_id,
        audio_url=file_path,
        text="" 
    )
    db.add(transcript)
    db.commit()
    db.refresh(transcript)
    
    # Trigger transcription in background
    background_tasks.add_task(process_audio_task, transcript.id, file_path, db)
    
    return {"message": "Audio uploaded successfully, transcription started", "transcript_id": transcript.id}

@router.get("/reports/{report_id}")
async def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(UploadedReport).filter(UploadedReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.get("/patient/{patient_id}/reports")
async def get_patient_reports(patient_id: int, db: Session = Depends(get_db)):
    reports = db.query(UploadedReport).filter(UploadedReport.patient_id == patient_id).all()
    return reports
