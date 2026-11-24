# Short Project Demonstration Script
### 3 to 5-Minute Video / Live Presentation Walkthrough

---

## Demonstration Overview
- **Project Name**: Vocalix — Text-to-Speech Studio
- **Demonstrator**: Student / Project Presenter
- **Target Audience**: Academic Reviewers, Professors, Evaluators
- **Duration**: ~3 to 4 minutes
- **Live Local URL**: `http://localhost:5173`

---

## Scene-by-Scene Script

### Scene 1: Introduction & UI Walkthrough (0:00 – 0:45)
- **Visual**: Screen recording at `http://localhost:5173`. Browser shows clean light mode with the Vocalix logo and the text editor.
- **Presenter Script**:
  > *"Hello everyone! Today I am presenting **Vocalix**, a modern, full-stack Text-to-Speech Web Application built with React.js, Vite, Node.js, and Express.js.*
  > *As you can see on screen, the user interface is completely responsive, clean, and distraction-free. In the header, we have our brand logo, a live backend connectivity indicator showing that our REST API is active, and an accessible theme switcher that toggles seamlessly between light and dark modes, persisting user preference across sessions."*
- **Action**: Click the theme toggle button in the top right to switch to dark mode, then back to light mode.

---

### Scene 2: Text Ingestion & Real-Time Metrics (0:45 – 1:30)
- **Visual**: Focus on the text area and statistics row.
- **Presenter Script**:
  > *"In the center, we have our text input card. Users can type or paste up to 5,000 characters. Notice that as I type or select one of our quick sample chips, our application dynamically calculates character count, word count, and estimated audio playback duration in real-time.*
  > *We also support one-click `.txt` file uploads. Let me click 'Upload .txt' and load a document — the text is instantly parsed and loaded into the editor."*
- **Action**: Click the "🌸 Female Voice Sample" chip, then show the updated counters: `131 characters | 23 words (~10s audio)`.

---

### Scene 3: Voice Selection, Gender Tagging & Preview (1:30 – 2:15)
- **Visual**: Dropdowns for Language and Voice.
- **Presenter Script**:
  > *"Next are the Language and Voice selectors. Vocalix automatically queries the user's operating system to discover all installed natural voices across languages such as English, Hindi, Gujarati, Spanish, French, and Japanese.*
  > *Notice that we categorize voices clearly into Male and Female profiles. Before speaking the entire text, the user can click the 'Preview' button to hear a quick, natural audio sample of the selected voice."*
- **Action**: Select `English (United States)`, choose `👨 Male: Microsoft David`, and click the "Preview" button to play audio.

---

### Scene 4: Acoustic Customization & Speech Generation (2:15 – 3:00)
- **Visual**: Sliders for Speed, Pitch, Volume, followed by clicking the "Generate Speech" button.
- **Presenter Script**:
  > *"In the Voice Settings section, we provide precise acoustic sliders for playback speed, pitch, and volume. Let's adjust the speed to 1.1x and keep pitch at standard 1.0.*
  > *Now I will click the prominent 'Generate Speech' button. Watch how the player bar updates in real-time."*
- **Action**: Click "Generate Speech".
- **Audio Output**: Voice begins reading the text aloud.
- **Visual**: The play button toggles to pause, the timer increments smoothly (`0:01 / 0:10`), and the progress scrubber line tracks across the player.

---

### Scene 5: Audio Controls & Real MP3 Download (3:00 – 3:45)
- **Visual**: Focus on the Audio Player bar at the bottom.
- **Presenter Script**:
  > *"During playback, the user has full control to pause, resume, or stop speech at any moment. Furthermore, unlike basic web implementations that only stream to the speaker, Vocalix connects to our Node.js backend to synthesize real `.mp3` audio files.*
  > *Let me click the 'Download' button. As you can see, our backend generates and delivers a genuine binary MP3 file directly to our downloads folder, ready for offline playback."*
- **Action**: Click "Pause", click "Resume", then click "Download". The browser saves `vocalix_speech_<timestamp>.mp3`. Open the file to confirm it plays.

---

### Scene 6: Conclusion (3:45 – 4:00)
- **Presenter Script**:
  > *"In conclusion, Vocalix provides a production-quality, accessible, and free solution for converting text to speech without requiring paid API keys. All 21 frontend and backend unit tests pass with flying colors. Thank you for your time, and I welcome any questions!"*
