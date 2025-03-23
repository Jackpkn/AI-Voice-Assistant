from faster_whisper import WhisperModel

# Load Whisper model once (base model is lightweight)
model = WhisperModel("base", device="cpu", compute_type="int8")

def transcribe_audio(file_path: str) -> str:
    """Transcribes an audio file and returns the text."""
    segments, _ = model.transcribe(file_path)
    return " ".join([segment.text for segment in segments])
