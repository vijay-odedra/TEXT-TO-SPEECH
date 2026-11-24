import React from 'react';
import { Play, Pause, Square, RotateCcw, Volume2, Mic } from 'lucide-react';

const SpeechControls = ({
  isSpeaking,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onStop,
  onRestart,
  canPlay = false,
  disabled = false
}) => {
  return (
    <div className="speech-controls-bar">
      <div className="playback-status-row">
        <div className="playback-status-indicator">
          <span className={`status-dot ${isSpeaking && !isPaused ? 'active' : isPaused ? 'paused' : 'idle'}`} />
          <span className="status-text">
            {isSpeaking && !isPaused && 'Speaking Active'}
            {isPaused && 'Paused'}
            {!isSpeaking && !isPaused && 'Ready to Speak'}
          </span>
        </div>

        {/* Live Audio Visualizer Equalizer Waves */}
        {isSpeaking && !isPaused && (
          <div className="equalizer-waves" aria-hidden="true">
            <span className="eq-bar bar-1"></span>
            <span className="eq-bar bar-2"></span>
            <span className="eq-bar bar-3"></span>
            <span className="eq-bar bar-4"></span>
            <span className="eq-bar bar-5"></span>
          </div>
        )}
      </div>

      <div className="control-buttons-group">
        {/* Play or Resume */}
        {isPaused ? (
          <button
            type="button"
            className="ctrl-btn ctrl-btn-primary"
            onClick={onResume}
            disabled={disabled}
            title="Resume playback"
            aria-label="Resume speech"
          >
            <Play size={18} />
            <span>Resume</span>
          </button>
        ) : (
          <button
            type="button"
            className="ctrl-btn ctrl-btn-primary"
            onClick={onPlay}
            disabled={disabled || !canPlay || (isSpeaking && !isPaused)}
            title="Start speech synthesis"
            aria-label="Play speech"
          >
            <Play size={18} />
            <span>Play</span>
          </button>
        )}

        {/* Pause */}
        <button
          type="button"
          className="ctrl-btn ctrl-btn-secondary"
          onClick={onPause}
          disabled={disabled || !isSpeaking || isPaused}
          title="Pause playback"
          aria-label="Pause speech"
        >
          <Pause size={18} />
          <span>Pause</span>
        </button>

        {/* Stop */}
        <button
          type="button"
          className="ctrl-btn ctrl-btn-danger"
          onClick={onStop}
          disabled={disabled || (!isSpeaking && !isPaused)}
          title="Stop speech playback"
          aria-label="Stop speech"
        >
          <Square size={18} />
          <span>Stop</span>
        </button>

        {/* Restart */}
        <button
          type="button"
          className="ctrl-btn ctrl-btn-outline"
          onClick={onRestart}
          disabled={disabled || (!isSpeaking && !isPaused && !canPlay)}
          title="Restart speech from beginning"
          aria-label="Restart speech"
        >
          <RotateCcw size={18} />
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
};

export default SpeechControls;
