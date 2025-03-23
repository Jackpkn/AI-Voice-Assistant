from fastapi import APIRouter, UploadFile, File
from app.stt import transcribe_audio
from app.ai import get_ai_response
import os

router = APIRouter()

@router.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    """Transcribes audio file to text."""
    file_path = f"temp_{file.filename}"

    # Save file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Transcribe
    text = transcribe_audio(file_path)
    os.remove(file_path)  # Cleanup
    return {"transcription": text}

from fastapi import HTTPException

@router.post("/ask/")
async def ask(question: str):
    """Gets AI-generated response."""
    try:
        response = get_ai_response(question)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

