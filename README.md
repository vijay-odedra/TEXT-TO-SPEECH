# Text to Speech Studio (Full-Stack Web Application)

A professional, modern, responsive, and fully functional Text-to-Speech (TTS) web application built using **React.js**, **Vite**, **Node.js**, and **Express.js**. Designed for high reliability, accessibility, and clean architectural separation.

---

## 1. Project Title
**Text to Speech Studio — Full-Stack Natural Speech Synthesis Suite**

---

## 2. Project Introduction
**Text to Speech Studio** is an interactive web studio that transforms digital text into natural, lifelike vocal output. Built with a dual-engine architecture, it provides instant, zero-cost, privacy-first client-side synthesis via the **Web Speech API** (`window.speechSynthesis`), while featuring a modular **Node.js/Express REST API backend** engineered for enterprise external speech provider integrations (such as OpenAI, ElevenLabs, and Google Cloud Text-to-Speech).

---

## 3. Problem Statement
Many existing text-to-speech tools suffer from:
- Mandatory paid subscriptions and compulsory API keys just for basic demonstration.
- Sluggish server round-trips for simple client-side text previews.
- Lack of graceful fallbacks when network connections fail or third-party quotas are reached.
- Cluttered, non-responsive user interfaces with rigid layout scaling on mobile and tablet screens.
- Inaccurate playback representations (e.g. fake progress bars or non-functional download buttons for synthesized streams).

**Text to Speech Studio** solves these issues by pairing dynamic local voice enumeration with honest playback states, granular speech acoustics customization, and an extensible backend architecture.

---

## 4. Objectives
- Provide a responsive dashboard to type, paste, or upload plain text documents.
- Dynamically detect and enumerate installed voices without hardcoding non-existent voices.
- Give users fine-grained control over speech acoustics: playback rate (speed), pitch, and volume.
- Accurately communicate audio states (playing, paused, stopped, restarted) without fake progress representations.
- Deliver persistent visual accessibility with light and dark themes.
- Implement robust input validation and defensive error handling on both client and server tiers.
- Create a clean full-stack codebase suitable for college project demonstrations and developer portfolios.

---

## 5. Features

### Core Synthesis & Playback
- **Browser Native Speech Synthesis**: Runs zero-cost, offline-capable voice generation using the browser's `SpeechSynthesis` engine.
- **Dynamic Voice & Language Discovery**: Dynamically scans user operating system voices (including English, Hindi, Gujarati, Marathi, Spanish, French, German, Italian, Portuguese, Japanese, Chinese, etc.).
- **Voice Preview Button**: Plays a sample sentence in the native language of the selected voice before generating full text.
- **Full Playback Controls**: Dedicated Play, Pause, Resume, Stop, and Restart controls with live visual playback status indicator.
- **Acoustic Customization**:
  - **Speed (Rate)**: Continuous slider from `0.5x` (slow) to `2.0x` (fast).
  - **Pitch**: Continuous slider from `0.5` (deep) to `2.0` (high).
  - **Volume**: Continuous slider from `0%` (mute) to `100%` (max).
  - **Reset**: One-click restore to standard baseline defaults.

### Text Management & Analysis
- **Live Text Statistics**: Displays character count, word count, and dynamic estimated speech duration calibrated to the user's selected speech speed.
- **Configurable Character Limit**: Default 5,000 character buffer with real-time warning indicators.
- **Document Upload (.txt)**: Drag-and-drop or file picker support to safely read `.txt` files up to 1 MB into the editor.
- **Clipboard Integration**: One-click text copy and clean textarea clearing.

### UI/UX & System Architecture
- **Theme Persistence**: Light and Dark mode toggle with preference preserved across sessions via `localStorage`.
- **Backend Health & Connection Monitoring**: Automatic heartbeat verifying Express API status with live indicator badges.
- **Modular Audio Player & Real Downloader**: Real HTML5 audio player with seeking and `.mp3`/`.wav` downloads when synthesized via backend external providers.
- **Accessible & Mobile Responsive**: Fluid flexbox and CSS grid layout that adapts cleanly to mobile, tablet, laptop, and desktop screens without horizontal overflow.

---

## 6. Technologies Used

### Frontend
- **React.js 19**: Component-driven declarative UI.
- **Vite 6 / 8**: Next-generation lightning-fast frontend tooling and bundling.
- **JavaScript (ES6+)**: Modern asynchronous idioms, hooks, and closures.
- **Lucide React**: Clean, accessible vector iconography.
- **Axios**: Promised-based HTTP client for backend API communication.
- **Vanilla CSS3**: Design token system, CSS variables, dark/light theme engine, and responsive grid.

### Backend
- **Node.js**: Asynchronous event-driven JavaScript runtime (v18+ / v20+ / v24+).
- **Express.js 4**: Fast, unopinionated REST API framework.
- **CORS**: Cross-Origin Resource Sharing middleware.
- **dotenv**: Environment variable management.
- **Native Fetch & Streams**: Provider communication and binary audio buffer streaming.

### Testing
- **Node.js Native Test Runner (`node:test`, `node:assert`)**: Zero-dependency, ultra-fast test suite.
- **Supertest**: HTTP assertion library for backend route testing.

---

## 7. Architecture

```
                  +----------------------------------------------+
                  |               USER BROWSER                   |
                  |                                              |
                  |   React + Vite SPA                           |
                  |   ├── Text Editor & Stats                    |
                  |   ├── Dynamic Voice Discovery                |
                  |   ├── Speech Customization (Speed/Pitch/Vol) |
                  |   └── Theme Manager (Light / Dark)           |
                  +-------------+------------------+-------------+
                                |                  |
      Engine: Browser (Default) |                  | Engine: Backend
                                v                  v
             +-----------------------+    +-----------------------+
             |   Web Speech API      |    |   Express REST API    |
             |   SpeechSynthesis     |    |   (Node.js / Express) |
             |   Utterance Engine    |    +-----------+-----------+
             +-----------------------+                |
                                                      | Modular Service Layer
                                                      v
                                          +-----------------------+
                                          | TTS Service Providers |
                                          | ├── Browser Fallback  |
                                          | ├── OpenAI TTS        |
                                          | └── ElevenLabs TTS    |
                                          +-----------------------+
```

---

## 8. Project Structure

```
TEXT-TO-SPEECH/
├── client/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── AudioPlayer.jsx
│   │   │   ├── EngineSelector.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── GenerateButton.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── LanguageSelector.jsx
│   │   │   ├── Notification.jsx
│   │   │   ├── SpeechControls.jsx
│   │   │   ├── SpeechSettings.jsx
│   │   │   ├── TextInput.jsx
│   │   │   ├── TextStats.jsx
│   │   │   ├── VoicePreview.jsx
│   │   │   └── VoiceSelector.jsx
│   │   ├── hooks/
│   │   │   ├── useSpeechSynthesis.js
│   │   │   └── useTheme.js
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   ├── textStats.js
│   │   │   └── utils.test.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   ├── healthController.js
│   │   └── ttsController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validationMiddleware.js
│   ├── routes/
│   │   ├── healthRoutes.js
│   │   └── ttsRoutes.js
│   ├── services/
│   │   ├── providers/
│   │   │   ├── browserFallbackProvider.js
│   │   │   ├── elevenLabsTtsProvider.js
│   │   │   └── openAiTtsProvider.js
│   │   └── ttsService.js
│   ├── tests/
│   │   └── api.test.js
│   ├── utils/
│   │   └── logger.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## 9. Installation Instructions

### Prerequisites
- **Node.js**: Version 18.0.0 or later (Node 20+ or 24+ recommended).
- **npm**: Version 9.0.0 or later.
- Modern browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari).

### Clone or Open the Repository
Open a terminal in the project root directory:
```bash
cd C:\Users\odedr\OneDrive\Documents\TEXT-TO-SPEECH
```

---

## 10. Frontend Setup
Navigate to the `client` directory and install dependencies:
```powershell
cd client
npm.cmd install
```
Configure environment variables:
```powershell
copy .env.example .env
```

---

## 11. Backend Setup
Navigate to the `server` directory and install dependencies:
```powershell
cd ..\server
npm.cmd install
```
Configure environment variables:
```powershell
copy .env.example .env
```

---

## 12. Environment Variables

### Backend (`server/.env`)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5005` | Port on which the Express server listens |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin for client requests |
| `TTS_PROVIDER` | `browser` | Active provider: `browser`, `openai`, or `elevenlabs` |
| `TTS_API_KEY` | *(empty)* | Optional API key for OpenAI or ElevenLabs |
| `TTS_ENDPOINT` | *(empty)* | Optional custom API endpoint |
| `TTS_MODEL` | *(empty)* | Optional provider model (e.g. `tts-1`) |
| `MAX_TEXT_LENGTH`| `5000` | Maximum character limit per synthesis request |

### Frontend (`client/.env`)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:5005`| Base URL of the backend Express server |

---

## 13. How to Run the Project

### Option A: From Root (Recommended)
You can start both or individual parts from the root `package.json`:

1. **Start the Backend Server (Terminal 1)**:
   ```powershell
   npm.cmd run server
   ```
   *Server runs at `http://localhost:5005`*

2. **Start the Frontend Client (Terminal 2)**:
   ```powershell
   npm.cmd run client
   ```
   *Client opens at `http://localhost:5173`*

### Option B: Running Individually
- **Backend**:
  ```powershell
  cd server
  npm.cmd start
  ```
- **Frontend**:
  ```powershell
  cd client
  npm.cmd run dev
  ```

Open your web browser and navigate to:
**`http://localhost:5173`**

---

## 14. API Endpoints

### 1. Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Verifies server health and uptime.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Text-to-Speech server is running",
    "timestamp": "2026-11-24T01:50:17.075Z",
    "uptime": 12.4
  }
  ```

### 2. Provider Status
- **Endpoint**: `GET /api/status`
- **Description**: Inspects current active TTS provider configuration.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "activeProvider": "browser",
      "isConfigured": true,
      "availableProviders": ["browser", "openai", "elevenlabs"],
      "browserSpeechSynthesisDefault": true
    }
  }
  ```

### 3. Voices List
- **Endpoint**: `GET /api/voices`
- **Description**: Returns provider voices or client-side discovery information.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "provider": "browser",
    "clientDriven": true,
    "voices": [],
    "message": "Browser Web Speech API voices are installed directly on the client operating system..."
  }
  ```

### 4. Audio Synthesis
- **Endpoint**: `POST /api/tts`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "text": "Hello, welcome to Text to Speech Studio.",
    "language": "en-US",
    "voice": "Microsoft David",
    "speed": 1.0,
    "pitch": 1.0,
    "volume": 1.0
  }
  ```
- **Response**:
  - If external provider is configured: returns binary audio buffer (`audio/mpeg`) with `Content-Disposition: attachment; filename="speech.mp3"`.
  - If in browser mode: returns clear instructional JSON informing frontend to use native Web Speech API.

---

## 15. Testing Instructions

Automated test suites exist for both backend endpoints and frontend text utilities.

### Run All Tests (Root)
```powershell
npm.cmd test
```

### Run Backend Tests Only
```powershell
cd server
npm.cmd test
```
*Executes 12 automated test cases covering health checks, status checks, invalid JSON, missing parameters, length boundaries, speed/pitch/volume range validations, and route 404s.*

### Run Frontend Tests Only
```powershell
cd client
npm.cmd test
```
*Executes 8 automated unit tests verifying word calculation, character counting, speech duration estimation algorithms, language code parsing, and file size formatters.*

---

## 16. Limitations
- **Browser Web Speech API Audio Downloading**: Direct MP3 file downloading is a recognized technical limitation of the W3C Web Speech API (`SpeechSynthesis`), as it outputs audio directly to the operating system's audio pipeline rather than producing an encoded binary audio buffer. Downloadable audio files (`.mp3`/`.wav`) are generated when external provider modes (e.g. OpenAI TTS) are configured.
- **OS-Dependent Installed Voices**: Voices available in the browser depend on the operating system (Windows voices on Windows, macOS voices on Mac, Android voices on Android).
- **Document Formats**: File upload currently natively supports plain text (`.txt`). PDF and DOCX parsing require heavy binary extractors (e.g., pdf-parse, mammoth) scheduled for future releases.

---

## 17. Screenshots & Interface Overview

- **Light Mode & Dark Mode**: Seamless toggle preserving high contrast, rounded modern cards, and subtle border glows.
- **Interactive Speech Customization**: Sliders with real-time value badges for rate, pitch, and volume.
- **Live Acoustic Indicators**: Color-coded status dots (Green = Speaking, Amber = Paused, Slate = Ready).
- **Backend Status Badge**: Real-time heartbeat pill showing backend API connection status.

---

## 18. Future Enhancements
- [ ] Integration with WebAssembly-based client-side speech encoders (e.g. Piper TTS WASM) for offline MP3 download.
- [ ] Server-side extraction support for `.pdf` and `.docx` file uploads.
- [ ] Speech-to-Text (STT) reverse transcription using `SpeechRecognition`.
- [ ] Saved snippet library in browser IndexedDB.
- [ ] Multi-voice dialog parsing (assigning different voices to different speakers).

---

## 19. Learning Outcomes
- Designing a robust multi-tier web application architecture adhering to clean software design patterns.
- Mastering the browser's native **Web Speech API** (`SpeechSynthesis`, `SpeechSynthesisUtterance`) and handling browser-specific quirks across Chromium and Gecko.
- Implementing defense-in-depth API validation and rate limiting using Express.js middleware.
- Writing reliable automated tests with Node.js built-in test runner (`node:test`) and Supertest.
- Building an accessible, responsive UI with state persistence using modern React hooks.

---

## 20. Conclusion
**Text to Speech Studio** offers a modern, transparent, and extensible solution for speech synthesis. By balancing free, client-side browser synthesis with a modular backend API ready for enterprise cloud providers, the project serves as an ideal baseline for college demonstrations, production tools, and accessibility software.
