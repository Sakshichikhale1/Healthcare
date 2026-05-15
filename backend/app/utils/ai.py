import os
import openai
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

async def get_chat_completion(messages, model="gpt-4o", response_format=None):
    try:
        response = await openai.ChatCompletion.acreate(
            model=model,
            messages=messages,
            response_format=response_format
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error in OpenAI completion: {e}")
        return None

async def transcribe_audio(file_path):
    try:
        with open(file_path, "rb") as audio_file:
            transcript = await openai.Audio.atranscribe(
                "whisper-1", 
                audio_file
            )
        return transcript["text"]
    except Exception as e:
        print(f"Error in Whisper transcription: {e}")
        return None
