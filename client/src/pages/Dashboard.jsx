import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  PenLine,
  Upload,
  Copy,
  Check,
  Trash2,
  Globe,
  Mic,
  Sliders,
  RotateCcw,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Download,
  Loader2,
  Info,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import Header from '../components/Header';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { detectVoiceGender, getLanguageLabel, getPreviewPhrase } from '../utils/formatters';
import { countCharacters, countWords, estimateDurationSeconds, formatDuration } from '../utils/textStats';
import api from '../services/api';

const MAX_CHAR_LIMIT = 5000;
const INITIAL_TEXT =
  'Welcome to Vocalix! Type or paste any text here to turn it into natural-sounding speech with male and female voices.';

const formatPlayerTime = (totalSeconds) => {
  const safe = Math.max(0, Math.floor(totalSeconds || 0));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const Dashboard = ({ backendConnected, theme, onToggleTheme }) => {
  const [text, setText] = useState(INITIAL_TEXT);
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [speechProgress, setSpeechProgress] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [notification, setNotification] = useState(null);

  const fileInputRef = useRef(null);

  const {
    isSupported,
    voices,
    languages,
    selectedLanguage,
    setSelectedLanguage,
    selectedVoice,
    setSelectedVoice,
    isSpeaking,
    isPaused,
    error: speechError,
    speak,
    pause,
    resume,
    stop
  } = useSpeechSynthesis();

  // Show errors from speech synthesis
  useEffect(() => {
    if (speechError) {
      setNotification({ type: 'error', message: speechError });
    }
  }, [speechError]);

  // Text metrics
  const charCount = countCharacters(text);
  const wordCount = countWords(text);
  const estSeconds = Math.max(1, estimateDurationSeconds(text, speed));

  // Audio Playback progress calculation & smooth timer counter
  useEffect(() => {
    let timer;
    if (isSpeaking && !isPaused) {
      const stepMs = 100;
      timer = setInterval(() => {
        setElapsedSec((prev) => {
          const next = prev + 0.1;
          if (next >= estSeconds) {
            setSpeechProgress(100);
            return estSeconds;
          }
          setSpeechProgress((next / estSeconds) * 100);
          return next;
        });
      }, stepMs);
    } else if (!isSpeaking && !isPaused) {
      setElapsedSec(0);
      setSpeechProgress(0);
    }

    return () => clearInterval(timer);
  }, [isSpeaking, isPaused, estSeconds]);

  // Filter voices that match current language
  const languageVoices = useMemo(() => {
    if (!voices || voices.length === 0) return [];

    const exactMatches = voices.filter(
      (v) => v.lang.replace('_', '-').toLowerCase() === selectedLanguage.toLowerCase()
    );
    if (exactMatches.length > 0) return exactMatches;

    const prefix = selectedLanguage.split(/[-_]/)[0].toLowerCase();
    const prefixMatches = voices.filter(
      (v) => v.lang.split(/[-_]/)[0].toLowerCase() === prefix
    );
    return prefixMatches.length > 0 ? prefixMatches : voices;
  }, [voices, selectedLanguage]);

  // Handle Play / Generate
  const handleGenerate = () => {
    if (!text.trim()) {
      setNotification({ type: 'error', message: 'Please enter text to synthesize.' });
      return;
    }
    setNotification(null);
    stop();
    setSpeechProgress(0);
    setElapsedSec(0);

    speak(text, {
      voice: selectedVoice,
      language: selectedLanguage,
      speed,
      pitch,
      volume: isMuted ? 0 : volume
    });
  };

  // Preview selected voice with a short phrase
  const handlePreviewVoice = () => {
    if (!selectedVoice) return;
    setIsPreviewing(true);
    const phrase = getPreviewPhrase(selectedLanguage);

    speak(phrase, {
      voice: selectedVoice,
      language: selectedLanguage,
      speed: 1.0,
      pitch: 1.0,
      volume: 1.0
    });

    setTimeout(() => {
      setIsPreviewing(false);
    }, 3500);
  };

  // Handle Copy
  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setNotification({ type: 'success', message: 'Text copied to clipboard.' });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Handle Clear
  const handleClear = () => {
    setText('');
    stop();
    setSpeechProgress(0);
    setElapsedSec(0);
  };

  // Handle Stop & Reset
  const handleStop = () => {
    stop();
    setSpeechProgress(0);
    setElapsedSec(0);
  };

  // Handle Play/Pause toggle
  const handlePlayToggle = () => {
    if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      handleGenerate();
    }
  };

  // Handle Interactive Seeker Click
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    setSpeechProgress(percent);
    const targetSec = (percent / 100) * estSeconds;
    setElapsedSec(targetSec);

    // If currently speaking, jump speech to that part of the text
    if (isSpeaking) {
      stop();
      const words = text.trim().split(/\s+/);
      const startWordIdx = Math.floor((percent / 100) * words.length);
      const remainingText = words.slice(startWordIdx).join(' ');
      if (remainingText) {
        speak(remainingText, {
          voice: selectedVoice,
          language: selectedLanguage,
          speed,
          pitch,
          volume: isMuted ? 0 : volume
        });
      }
    }
  };

  // Handle File Upload (.txt)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt')) {
      setNotification({ type: 'error', message: 'Only .txt files are supported.' });
      return;
    }

    if (file.size > 1024 * 1024) {
      setNotification({ type: 'error', message: 'File is too large (max 1 MB).' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        if (!content.trim()) {
          setNotification({ type: 'error', message: 'The selected file is empty.' });
          return;
        }
        setText(content.slice(0, MAX_CHAR_LIMIT));
        setNotification({
          type: 'success',
          message: `Loaded "${file.name}" (${content.length} characters)`
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle Real Audio Download (.mp3)
  const handleDownloadMp3 = async () => {
    if (!text.trim()) {
      setNotification({ type: 'error', message: 'Enter text to download audio.' });
      return;
    }

    setIsDownloading(true);
    setNotification(null);

    try {
      const result = await api.synthesizeBackendAudio({
        text: text.trim(),
        language: selectedLanguage,
        voice: selectedVoice?.name || '',
        speed,
        pitch,
        volume: isMuted ? 0 : volume
      });

      let downloadUrl = null;
      let shouldRevoke = false;

      if (result && result.audioUrl) {
        downloadUrl = result.audioUrl;
      } else if (result && result.blob instanceof Blob) {
        downloadUrl = URL.createObjectURL(result.blob);
        shouldRevoke = true;
      } else if (result instanceof Blob) {
        downloadUrl = URL.createObjectURL(result);
        shouldRevoke = true;
      }

      if (!downloadUrl) {
        throw new Error('No downloadable audio received from server.');
      }

      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = `vocalix_speech_${Date.now()}.mp3`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      if (shouldRevoke) {
        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1500);
      }

      setNotification({
        type: 'success',
        message: 'Audio MP3 downloaded successfully!'
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || 'Could not download audio. Check backend connection.'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Reset voice settings to default
  const handleResetSettings = () => {
    setSpeed(1.0);
    setPitch(1.0);
    setVolume(1.0);
    setIsMuted(false);
    setNotification({
      type: 'success',
      message: 'Voice settings reset to defaults (Speed 1.0x, Pitch 1.0, Volume 100%)'
    });
    setTimeout(() => {
      setNotification((curr) => (curr?.message?.includes('Voice settings reset') ? null : curr));
    }, 2500);
  };

  return (
    <div className="vocalix-main-container">
      {/* Top Header */}
      <Header
        theme={theme}
        onToggleTheme={onToggleTheme}
        backendConnected={backendConnected}
      />

      {/* Global Notification Toast */}
      {notification && (
        <div className={`vocalix-toast ${notification.type}`}>
          <div className="toast-left">
            {notification.type === 'success' ? (
              <CheckCircle2 size={18} className="toast-icon success" />
            ) : (
              <AlertCircle size={18} className="toast-icon error" />
            )}
            <span className="toast-message">{notification.message}</span>
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => setNotification(null)}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Vocalix TTS Card */}
      <main className="vocalix-studio-card">
        {/* Card Header: Title + Upload */}
        <div className="studio-card-head">
          <div className="head-title-row">
            <PenLine size={18} className="head-pen-icon" />
            <h2 className="head-title">Enter your text</h2>
          </div>
          <div className="head-actions">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="upload-txt-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Upload a .txt document"
            >
              <Upload size={14} />
              <span>Upload .txt</span>
            </button>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="vocalix-textarea-wrap">
          <textarea
            className="vocalix-textarea"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHAR_LIMIT))}
            placeholder="Type or paste your text here..."
            rows={6}
          />
        </div>

        {/* Text Statistics & Actions Row */}
        <div className="textarea-stats-actions-row">
          <div className="stats-col">
            <span className="stat-text">
              {charCount} characters | {wordCount} words
            </span>
            <span className="stat-est">
              (~{formatDuration(estSeconds)} audio)
            </span>
          </div>

          <div className="actions-col">
            <button
              type="button"
              className="action-btn-pill"
              onClick={handleClear}
              disabled={!text}
              title="Clear all text"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>

            <button
              type="button"
              className={`action-btn-pill ${isCopied ? 'copied' : ''}`}
              onClick={handleCopy}
              disabled={!text}
              title="Copy text to clipboard"
            >
              {isCopied ? <Check size={14} /> : <Copy size={14} />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Language & Voice Selectors (2-Column Grid) */}
        <div className="vocalix-selectors-grid">
          {/* Language Selector */}
          <div className="selector-box">
            <div className="selector-label-row">
              <Globe size={18} className="selector-icon blue" />
              <div className="selector-text-meta">
                <span className="selector-title">Language</span>
                <span className="selector-sub">
                  {getLanguageLabel(selectedLanguage)}
                </span>
              </div>
            </div>
            <select
              className="vocalix-native-select"
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                stop();
              }}
              aria-label="Select speech language"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {getLanguageLabel(lang)} ({lang})
                </option>
              ))}
            </select>
          </div>

          {/* Voice Selector */}
          <div className="selector-box">
            <div className="selector-label-row">
              <Mic size={18} className="selector-icon blue" />
              <div className="selector-text-meta">
                <span className="selector-title">Voice</span>
                <span className="selector-sub">
                  {selectedVoice ? (
                    <>
                      {detectVoiceGender(selectedVoice) === 'male' ? '👨 Male' : '👩 Female'} Voice
                    </>
                  ) : (
                    'Select a voice'
                  )}
                </span>
              </div>
            </div>

            <div className="voice-select-with-preview">
              <select
                className="vocalix-native-select"
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const match = voices.find((v) => v.name === e.target.value);
                  if (match) setSelectedVoice(match);
                  stop();
                }}
                aria-label="Select speech voice"
              >
                {languageVoices.length === 0 ? (
                  <option value="">No voices for this language</option>
                ) : (
                  languageVoices.map((v) => {
                    const gender = detectVoiceGender(v);
                    const genderTag = gender === 'male' ? '👨 Male' : '👩 Female';
                    return (
                      <option key={v.name} value={v.name}>
                        {genderTag}: {v.name} ({v.lang})
                      </option>
                    );
                  })
                )}
              </select>

              <button
                type="button"
                className={`voice-preview-btn ${isPreviewing ? 'previewing' : ''}`}
                onClick={handlePreviewVoice}
                disabled={!selectedVoice || isPreviewing}
                title="Preview this voice"
              >
                <Volume2 size={16} />
                <span>{isPreviewing ? 'Playing...' : 'Preview'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Voice Settings Section */}
        <div className="vocalix-settings-card">
          <div className="settings-header-row">
            <div className="settings-title-group">
              <Sliders size={16} className="settings-icon" />
              <h3 className="settings-title">Voice Settings</h3>
            </div>
            <button
              type="button"
              className="reset-settings-btn"
              onClick={handleResetSettings}
              title="Reset speed, pitch, and volume to default"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>

          <div className="settings-sliders-grid">
            {/* Speed Slider */}
            <div className="slider-item">
              <div className="slider-top-label">
                <span className="slider-name">Speed: {speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                className="vocalix-range-slider"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
              />
              <div className="slider-ticks-row">
                <span>0.5x</span>
                <span>2.0x</span>
              </div>
            </div>

            {/* Pitch Slider */}
            <div className="slider-item">
              <div className="slider-top-label">
                <span className="slider-name">Pitch: {pitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                className="vocalix-range-slider"
                min="0.5"
                max="2.0"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
              />
              <div className="slider-ticks-row">
                <span>0.5</span>
                <span>2.0</span>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="slider-item">
              <div className="slider-top-label">
                <span className="slider-name">
                  Volume: {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                className="vocalix-range-slider"
                min="0"
                max="1.0"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
              />
              <div className="slider-ticks-row">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Speech Main Button */}
        <div className="vocalix-generate-row">
          <button
            type="button"
            className="vocalix-generate-btn"
            onClick={handleGenerate}
            disabled={!text.trim() || !isSupported}
            title={!isSupported ? 'Speech synthesis not supported in this browser' : 'Generate and speak speech'}
          >
            {isSpeaking && !isPaused ? (
              <Loader2 size={20} className="spin-icon" />
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="9" width="3" height="6" rx="1.5" fill="currentColor" />
                <rect x="7" y="5" width="3" height="14" rx="1.5" fill="currentColor" />
                <rect x="12" y="3" width="3" height="18" rx="1.5" fill="currentColor" />
                <rect x="17" y="7" width="3" height="10" rx="1.5" fill="currentColor" />
                <rect x="22" y="10" width="3" height="4" rx="1.5" fill="currentColor" />
              </svg>
            )}
            <span className="btn-label">
              {isSpeaking && !isPaused ? 'Speaking...' : 'Generate Speech'}
            </span>
            <span className="btn-arrow">→</span>
          </button>
        </div>

        {/* Audio Player Control Bar */}
        <div className="vocalix-player-bar">
          <div className="player-controls-left">
            {/* Play / Pause Circle Button */}
            <button
              type="button"
              className="player-play-circle"
              onClick={handlePlayToggle}
              title={isSpeaking && !isPaused ? 'Pause' : isPaused ? 'Resume' : 'Play'}
              aria-label={isSpeaking && !isPaused ? 'Pause' : isPaused ? 'Resume' : 'Play'}
            >
              {isSpeaking && !isPaused ? (
                <Pause size={18} />
              ) : (
                <Play size={18} className="play-triangle-offset" />
              )}
            </button>

            {/* Stop Button */}
            <button
              type="button"
              className="player-stop-btn"
              onClick={handleStop}
              title="Stop playback"
              aria-label="Stop playback"
            >
              <Square size={13} />
            </button>

            {/* Time Stamp (e.g. 0:00 / 0:14) */}
            <span className="player-time">
              {formatPlayerTime(isSpeaking || isPaused ? elapsedSec : 0)} / {formatPlayerTime(estSeconds)}
            </span>
          </div>

          {/* Interactive Progress Seeker Bar */}
          <div
            className="player-seeker-container"
            onClick={handleSeek}
            title="Click to seek position"
          >
            <div className="seeker-track">
              <div
                className="seeker-fill-bar"
                style={{ width: `${isSpeaking || isPaused ? Math.min(100, speechProgress) : 0}%` }}
              >
                <div className="seeker-thumb"></div>
              </div>
            </div>
          </div>

          {/* Right Controls: Volume + Real MP3 Download */}
          <div className="player-controls-right">
            <button
              type="button"
              className="player-tool-btn"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                setNotification({
                  type: 'success',
                  message: nextMuted ? 'Audio muted' : 'Audio unmuted'
                });
              }}
              title={isMuted ? 'Unmute audio' : 'Mute audio'}
              aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <button
              type="button"
              className="player-download-btn"
              onClick={handleDownloadMp3}
              disabled={isDownloading || !text.trim()}
              title="Download real MP3 audio file"
            >
              {isDownloading ? (
                <Loader2 size={15} className="spin-icon" />
              ) : (
                <Download size={15} />
              )}
              <span>{isDownloading ? 'Synthesizing...' : 'Download'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Helper Info */}
        <div className="vocalix-bottom-note">
          <Info size={15} className="note-icon" />
          <span>Natural speech powered by browser engine & high-fidelity MP3 download.</span>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
