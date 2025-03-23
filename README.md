# Voice Assistant Project

A modern voice assistant application with a React Native frontend and FastAPI backend. This project enables voice-based interactions, speech-to-text conversion, and AI-powered responses.

## Project Structure

```
voice-assistant/
├── voice-assistant-app/     # React Native Frontend
└── voice-assistant-backend/ # FastAPI Backend
```

## Features

- 🎤 Voice input capture and processing
- 🔄 Real-time speech-to-text conversion using Whisper
- 🤖 AI-powered responses using Google's Generative AI
- 📱 Cross-platform mobile interface
- ⚡ Fast and efficient backend processing

## Backend (voice-assistant-backend)

The backend is built with FastAPI and provides:

- Speech-to-text conversion using faster-whisper
- Integration with Google's Generative AI
- RESTful API endpoints for voice processing
- Containerized deployment with Docker

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd voice-assistant-backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. Run with Docker:
   ```bash
   docker build -t voice-assistant-backend .
   docker run -p 8000:8000 --env-file .env voice-assistant-backend
   ```

   Or run locally:
   ```bash
   uvicorn app.main:app --reload
   ```

## Frontend (voice-assistant-app)

The frontend is a React Native application that provides:

- Clean and intuitive user interface
- Voice recording capabilities
- Real-time interaction with the backend
- Cross-platform compatibility

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd voice-assistant-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

4. Run on iOS/Android:
   ```bash
   # iOS
   npm run ios
   # Android
   npm run android
   ```

## API Documentation

The backend API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

### Backend (.env)
```
GOOGLE_API_KEY=your_google_api_key
PORT=8000
```

### Frontend (.env)
```
API_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/)
- [React Native](https://reactnative.dev/)
- [Whisper](https://github.com/openai/whisper)
- [Google Generative AI](https://cloud.google.com/ai-platform)
