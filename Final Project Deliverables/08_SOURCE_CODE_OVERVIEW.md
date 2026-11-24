# Source Code Architecture & Component Breakdown
### Modular Design & State Flow Reference

---

## 1. Architectural Highlights
The **Vocalix** application is engineered using clean separation of concerns, decoupling user interface components from underlying speech synthesis drivers and REST network layers.

```
                      +-------------------+
                      |      App.jsx      |
                      | (Theme, Heartbeat)|
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |   Dashboard.jsx   |
                      |  (Main Page View) |
                      +---------+---------+
                                |
       +------------------------+------------------------+
       |                        |                        |
       v                        v                        v
+--------------+       +-----------------+       +----------------+
|  Header.jsx  |       |  TextInput.jsx  |       | AudioPlayer.jsx|
| (Brand, Theme|       | (Text, Samples, |       | (Play, Seeker, |
|  & Status)   |       |  Word Counters) |       |  MP3 Download) |
+--------------+       +-----------------+       +----------------+
                                |
       +------------------------+------------------------+
       |                        |                        |
       v                        v                        v
+----------------+     +-----------------+       +----------------+
|LanguageSelector|     |  VoiceSelector  |       | SpeechSettings |
| (Locales List) |     | (Male/Female)   |       | (Speed, Pitch, |
+----------------+     +-----------------+       |  Volume Range) |
                                                 +----------------+
```

---

## 2. Component Directory

| Component / File | Purpose & Responsibilities |
| :--- | :--- |
| [`App.jsx`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/client/src/App.jsx) | Root container. Mounts theme provider and maintains 30-second heartbeat check with the Express REST API. |
| [`Dashboard.jsx`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/client/src/pages/Dashboard.jsx) | Primary studio view orchestrating input, voice filters, audio controls, live timers, and download triggers. |
| [`Header.jsx`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/client/src/components/Header.jsx) | Displays application brand identity, live backend connection pulse, and light/dark theme switch. |
| [`TextInput.jsx`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/client/src/components/TextInput.jsx) | Controlled textarea with quick sample prompt chips, copy button, and clear triggers. |
| [`TextStats.jsx`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/client/src/components/TextStats.jsx) | Calculates character counts, word counts, and estimated audio duration based on current speech speed. |
| [`FileUpload.jsx`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/client/src/components/FileUpload.jsx) | Safely reads local `.txt` documents using `FileReader`, applying size and format checks. |
| [`LanguageSelector.jsx`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/client/src/components/LanguageSelector.jsx) | Dropdown listing all system-supported language locales (English, Hindi, Gujarati, etc.). |
| [`VoiceSelector.jsx`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/client/src/components/VoiceSelector.jsx) | Voice chooser with heuristic male/female detection tags and instant audio sample preview. |
| [`SpeechSettings.jsx`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/client/src/components/SpeechSettings.jsx) | Sliders for speed (0.5x–2.0x), pitch (0.5–2.0), and volume (0%–100%) with reset functionality. |
| [`AudioPlayer.jsx`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/client/src/components/AudioPlayer.jsx) | Media controls with circular play button, dynamic timer (`0:00 / 0:14`), interactive seek line, and MP3 download. |

---

## 3. Custom React Hooks

### `useSpeechSynthesis.js`
- Wraps the browser's native `window.speechSynthesis` API.
- Implements asynchronous `onvoiceschanged` listener to dynamically populate voices across Windows, macOS, Linux, Android, and iOS.
- **Chromium Keepalive**: Runs an automated 14-second heartbeat cycle (`pause()` + `resume()`) preventing Chromium from garbage collecting utterances during long speeches.
- Exposes: `speak()`, `pause()`, `resume()`, `stop()`, `isSpeaking`, `isPaused`, and `voices`.

### `useTheme.js`
- Reads preferred theme from `localStorage` or OS `prefers-color-scheme`.
- Dynamically sets `data-theme="dark"` or `"light"` on the document root.

---

## 4. Backend Service Modules

| File | Purpose |
| :--- | :--- |
| [`server/server.js`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/server/server.js) | Initializes Express server, attaches middlewares, mounts `/api` routes, and starts listener on port 5005. |
| [`server/controllers/ttsController.js`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/server/controllers/ttsController.js) | Handles incoming HTTP requests, coordinates with TTS providers, and streams binary MP3 responses. |
| [`server/services/providers/freeTtsProvider.js`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/server/services/providers/freeTtsProvider.js) | Free synthesis service that chunks large text and compiles real binary MP3 audio buffers without API keys. |
| [`server/middleware/rateLimiter.js`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/server/middleware/rateLimiter.js) | In-memory sliding-window IP rate limiter preventing denial-of-service abuse. |
| [`server/middleware/validator.js`](file:///c:/Users/odedr/OneDrive/Documents/TEXT-TO-SPEECH/server/middleware/validator.js) | Validates text length (1–5000 chars), speed range (0.5–2.0), pitch (0.5–2.0), and volume (0.0–1.0). |
