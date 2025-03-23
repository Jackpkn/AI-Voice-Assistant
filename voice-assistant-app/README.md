# Voice Assistant App

A React Native application that converts speech to text and gets AI-powered responses. The app features a beautiful dark theme UI and supports various response formats including code snippets and documentation.

## Features

- 🎤 Voice Recording & Speech-to-Text
- 🤖 AI-powered responses
- 💻 Code snippet formatting
- 📝 Documentation-style responses
- 🌙 Dark theme UI
- 📱 Cross-platform (iOS & Android)
- ⚡ Real-time response formatting
- 🔄 Loading indicators
- 🚨 Error handling
- 🐳 Docker support

## Prerequisites

- Node.js >= 14 (for local development)
- npm or yarn (for local development)
- Docker and Docker Compose (for containerized setup)
- React Native development environment
- Expo CLI
- FastAPI backend server running

## Installation

### Option 1: Docker Installation (Recommended)

1. Clone both repositories:
```bash
git clone [your-frontend-repo-url] voice-assistant-app
git clone [your-backend-repo-url] voice-assistant-backend
```

2. Start the containers:
```bash
cd voice-assistant-app
docker-compose up --build
```

This will start both the frontend and backend services. The app will be available at:
- Frontend (Expo): http://localhost:19000
- Backend (FastAPI): http://localhost:8000

### Option 2: Local Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd voice-assistant-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Update the API URL:
Edit `App.tsx` and update the `API_URL` constant with your FastAPI server's IP address:
```typescript
const API_URL = Platform.select({
  android: 'http://YOUR_IP:8000',
  ios: 'http://localhost:8000',
  default: 'http://YOUR_IP:8000'
});
```

## Running the App

### Using Docker

```bash
# Start both frontend and backend
docker-compose up

# Start with rebuilding containers
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Local Development

1. Start the FastAPI backend server:
```bash
cd ../voice-assistant-backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

2. Start the React Native app:
```bash
npx expo start
```

3. Run on your device:
   - Scan the QR code with Expo Go (Android)
   - Press 'i' for iOS simulator
   - Press 'a' for Android emulator

## Usage

1. Press the large purple button to start recording
2. Speak your question or command
3. Press the button again (now red) to stop recording
4. Wait for the AI response
5. Scroll through the formatted response

## Response Types

The app automatically formats different types of responses:

- **Code Snippets**: Displayed in a monospace font with syntax highlighting
- **Documentation**: Properly formatted with headers and sections
- **General Questions**: Clean, readable text format

## Tech Stack

- React Native
- Expo
- TypeScript
- Axios
- react-native-markdown-display
- expo-av (for audio recording)
- Docker & Docker Compose

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 