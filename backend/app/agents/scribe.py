from app.utils.ai import transcribe_audio, get_chat_completion
from app.models.schema import Transcript, SoapNote
from sqlalchemy.orm import Session
import json

async def run_scribe_agent(consultation_id: int, audio_path: str, db: Session):
    # 1. Transcribe
    text = await transcribe_audio(audio_path)
    if not text:
        return {"status": "error", "message": "Transcription failed"}
    
    # Update transcript in DB
    transcript = db.query(Transcript).filter(Transcript.consultation_id == consultation_id).first()
    if transcript:
        transcript.text = text
        db.commit()

    # 2. Generate SOAP Note
    prompt = f"""
    You are a medical scribe. Based on the following consultation transcript, generate a structured SOAP note in JSON format.
    
    Transcript:
    {text}
    
    JSON format:
    {{
        "subjective": "...",
        "objective": "...",
        "assessment": "...",
        "plan": "..."
    }}
    """
    
    messages = [{"role": "system", "content": "You are a helpful medical assistant."}, {"role": "user", "content": prompt}]
    soap_json_str = await get_chat_completion(messages, response_format={"type": "json_object"})
    
    if soap_json_str:
        soap_data = json.loads(soap_json_str)
        
        # Save SOAP note to DB
        soap_note = db.query(SoapNote).filter(SoapNote.consultation_id == consultation_id).first()
        if not soap_note:
            soap_note = SoapNote(
                consultation_id=consultation_id,
                subjective=soap_data.get("subjective"),
                objective=soap_data.get("objective"),
                assessment=soap_data.get("assessment"),
                plan=soap_data.get("plan")
            )
            db.add(soap_note)
        else:
            soap_note.subjective = soap_data.get("subjective")
            soap_note.objective = soap_data.get("objective")
            soap_note.assessment = soap_data.get("assessment")
            soap_note.plan = soap_data.get("plan")
            
        db.commit()
        return {"status": "success", "soap_note": soap_data}
    
    return {"status": "error", "message": "SOAP note generation failed"}
