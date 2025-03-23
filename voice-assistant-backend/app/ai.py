import google.generativeai as genai
from app.config import Config
from app.prompts import get_full_prompt

# Configure Gemini API
genai.configure(api_key=Config.GEMINI_API_KEY)

# Initialize the Gemini model
gemini_model = genai.GenerativeModel("gemini-2.0-flash")

def get_ai_response(prompt: str) -> str:
    """Generates AI response using Google Gemini API."""
    try:
        full_prompt = get_full_prompt(prompt)
        response = gemini_model.generate_content(
            full_prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                top_p=0.8,
                top_k=40,
                candidate_count=1,
                stop_sequences=["User:", "Assistant:"],
                max_output_tokens=2048,
            )
        )
        return response.text if response else "I couldn't understand that."
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        return "I encountered an error while processing your request."
