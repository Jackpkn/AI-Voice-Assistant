from fastapi import FastAPI
from app.routes import router

app = FastAPI()

# Register routes
app.include_router(router)

@app.get("/")
def home():
    return {"message": "Voice Assistant Backend Running!"}
