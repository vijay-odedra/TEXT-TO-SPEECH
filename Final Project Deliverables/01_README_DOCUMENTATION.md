# Vocalix — Text-to-Speech Studio
### Complete Full-Stack Web Application Documentation

---

## 1. Executive Summary & Objective

**Vocalix** is an enterprise-grade, responsive, full-stack Text-to-Speech (TTS) web application built using **React.js, Vite, Node.js, and Express.js**. It transforms written text into crystal-clear, natural-sounding audio in real-time, supporting dynamic operating-system voices across multiple global and regional languages (English, Hindi, Gujarati, Marathi, Spanish, French, German, Japanese, and more) with fine-grained acoustic customization (speed, pitch, and volume) and downloadable MP3 audio files.

The application serves both modern desktop and mobile browsers, functioning with zero mandatory cloud credentials through the browser **Web Speech API** while backed by a modular Node.js REST API service for high-fidelity audio synthesis and export.

---

## 2. Key Features

- **Multi-Language & Voice Selection**: Dynamically enumerates OS-level male and female voices across international and regional Indian dialects (Hindi, Gujarati, Marathi, English).
- **Voice Previewing**: One-click preview button to test voice tone and pacing before generating full-length audio.
- **Acoustic Controls**: Sliders for playback speed (0.5x – 2.0x), pitch (0.5 – 2.0), and volume (0% – 100%) with live value badges and quick reset.
- **Audio Player & Seeker**: Play, pause, resume, and stop controls with dynamic timestamp countdown (`m:ss`), interactive scrubber bar, and volume muting.
- **Real MP3 Audio Export**: Download synthesized speech as true `.mp3` audio files via the backend audio synthesis engine.
- **File Ingestion**: One-click `.txt` document upload with file validation, character parsing, and safety limits.
- **Real-Time Analytics**: Live character counter, word counter, and speaking duration estimation.
- **Light & Dark Theme**: Sleek modern UI with persistent theme toggle via `localStorage`.
- **Responsive Architecture**: Fluid layout with zero horizontal overflow, tailored for desktop, tablet, and mobile.

---

## 3. Technology Stack

### Frontend
- **Framework**: React 19 + Vite (Fast HMR & Optimized Production Bundles)
- **Language**: JavaScript (ES2023)
- **Styling**: Modern CSS3 (Variables, Flexbox, CSS Grid, Glassmorphic effects)
- **Icons**: Lucide React
- **HTTP Client**: Axios (configured with timeout and error interceptors)
- **Audio API**: Web Speech API (`SpeechSynthesis`, `SpeechSynthesisUtterance`)

### Backend
- **Runtime**: Node.js (v20+ LTS)
- **Framework**: Express.js (REST API Architecture)
- **Security & Networking**: CORS, Rate Limiting, Input Sanitization, Payload Size Protections
- **Environment**: `dotenv` for configuration
- **Audio Synthesis**: Free TTS streaming chunk provider with MP3 binary buffer concatenation

---

## 4. Architecture Diagram

```
+-------------------------------------------------------------------------+
|                                CLIENT                                   |
|  [ React 19 + Vite ]                                                    |
|                                                                         |
|  +--------------------+  +--------------------+  +-------------------+  |
|  |     TextInput      |  |  Voice & Language  |  |  Speech Settings  |  |
|  | (Stats, FileUpload)|  | (Male/Female Enum) |  |  (Speed/Pitch/Vol)|  |
|  +---------+----------+  +---------+----------+  +---------+---------+  |
|            |                       |                       |            |
|            v                       v                       v            |
|  +-------------------------------------------------------------------+  |
|  |                     useSpeechSynthesis Hook                       |  |
|  |           (Web Speech API: speak, pause, resume, stop)            |  |
|  +---------------------------------+---------------------------------+  |
|                                    |                                    |
|                      Audio Download Request (Axios)                     |
+------------------------------------+------------------------------------+
                                     |
                                     | HTTP POST /api/tts
                                     v
+-------------------------------------------------------------------------+
|                                SERVER                                   |
|  [ Express.js REST API - Port 5005 ]                                    |
|                                                                         |
|  +---------------------+  +---------------------+  +-----------------+  |
|  |   Rate Limiter      |->| Request Validator   |->|  TTS Controller |  |
|  +---------------------+  +---------------------+  +--------+--------+  |
|                                                             |           |
|                                                             v           |
|                                                   +------------------+  |
|                                                   | Free TTS Service |  |
|                                                   |  (MP3 Synthesis) |  |
|                                                   +---------+--------+  |
|                                                             |           |
|                                         Stream Binary MP3   |           |
+-------------------------------------------------------------+-----------+
                                                              |
                                     Binary Audio Stream      |
                                     (audio/mpeg)             |
                                     <------------------------+
```

---

## 5. Directory Structure

```
TEXT-TO-SPEECH/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AudioPlayer.jsx
│   │   │   ├── FileUpload.jsx
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
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── controllers/
│   │   └── ttsController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── validator.js
│   ├── routes/
│   │   └── ttsRoutes.js
│   ├── services/
│   │   ├── providers/
│   │   │   └── freeTtsProvider.js
│   │   └── ttsService.js
│   ├── tests/
│   │   └── api.test.js
│   ├── utils/
│   │   └── logger.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── Final Project Deliverables/
│   ├── 01_README_DOCUMENTATION.md
│   ├── 02_API_DOCUMENTATION.md
│   ├── 03_DATABASE_SCHEMA.md
│   ├── 04_GITHUB_REPOSITORY.md
│   ├── 05_DEPLOYMENT_URL.md
│   ├── 06_PROJECT_PRESENTATION.md
│   ├── 07_SHORT_PROJECT_DEMONSTRATION.md
│   ├── 08_SOURCE_CODE_OVERVIEW.md
│   ├── Postman/
│   │   └── Vocalix_TTS_API.postman_collection.json
│   └── Screenshots/
├── .gitignore
├── package.json
└── README.md
```

---

## 6. Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- Modern web browser (Google Chrome, Microsoft Edge, Brave, Firefox, or Safari)

### Step 1: Clone or Open Repository
```bash
cd c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH
```

### Step 2: Install Dependencies
Run from the project root:
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### Step 3: Configure Environment Variables
Verify or create `server/.env`:
```env
PORT=5005
NODE_ENV=development
TTS_PROVIDER=free
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60
MAX_TEXT_LENGTH=5000
```

### Step 4: Run the Application
In development, run both services:
```bash
# Terminal 1 - Backend Server
node server/server.js

# Terminal 2 - Frontend Development Server
npm --prefix client run dev -- --host
```

### Step 5: Access the Web App
- **Frontend URL**: `http://localhost:5173`
- **Backend API**: `http://localhost:5005/api/health`

---

## 7. Running Automated Tests

Run the complete test suite (21 unit and integration tests):
```bash
npm test
```
- **Backend Integration Tests**: 12 tests covering route health, rate limiting, validations, and binary streaming.
- **Frontend Utility Tests**: 9 tests covering character counts, duration estimation, language resolution, and gender heuristics.

---

## 8. Troubleshooting & Edge Cases

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Silent Playback** | Operating system audio volume is muted or voice is initializing. | Check system output volume. Click the "Preview" button to wake the voice engine. |
| **Browser Speech Cut-off** | Chromium garbage collects utterances after 15 seconds. | Our custom hook `useSpeechSynthesis.js` has a 14-second keepalive timer that automatically prevents long texts from being interrupted. |
| **Download Failed** | Backend server is not running on port 5005. | Ensure `node server/server.js` is running and `http://localhost:5005/api/health` returns status 200. |
| **Gujarati / Hindi Voice Missing** | Windows language packs are not installed locally. | Go to Windows Settings > Time & Language > Speech > Add Voices, and install Hindi / Gujarati. |
