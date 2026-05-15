import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def summarize_text(text: str):
    """Summarize medical report text using OpenAI."""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a professional medical assistant. Summarize the following medical report into a concise JSON format with fields: summary, key_findings (list), and recommendations (list)."},
                {"role": "user", "content": text}
            ],
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error in summarize_text: {e}")
        return None

async def transcribe_audio(file_path: str):
    """Transcribe audio file using OpenAI Whisper."""
    try:
        audio_file = open(file_path, "rb")
        transcript = client.audio.transcriptions.create(
            model="whisper-1", 
            file=audio_file
        )
        return transcript.text
    except Exception as e:
        print(f"Error in transcribe_audio: {e}")
        return None

async def generate_chat_response(messages: list):
    """Generate a chat response for the Ask AI chatbot."""
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are ClinicOS AI, a helpful healthcare operating system assistant. Assist the doctor or administrator with clinical queries, billing, or report summaries."},
                *messages
            ],
            stream=True
        )
        return response
    except Exception as e:
        print(f"Error in generate_chat_response: {e}")
        return None
