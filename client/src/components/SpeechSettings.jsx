import React from 'react';
import { Gauge, Sliders, Volume2, RotateCcw, Wand2 } from 'lucide-react';

const SpeechSettings = ({
  speed = 1.0,
  pitch = 1.0,
  volume = 1.0,
  onSpeedChange,
  onPitchChange,
  onVolumeChange,
  onReset,
  disabled = false
}) => {
  const applyPreset = (newPitch, newSpeed) => {
    onPitchChange(newPitch);
    if (newSpeed) onSpeedChange(newSpeed);
  };

  return (
    <div className="card settings-card">
      <div className="card-header">
        <div className="card-title-group">
          <Sliders size={20} className="card-title-icon" />
          <h3 className="card-title">Speech Customization</h3>
        </div>
        <button
          type="button"
          className="btn-icon"
          onClick={onReset}
          disabled={disabled || (speed === 1.0 && pitch === 1.0 && volume === 1.0)}
          title="Reset to default settings"
          aria-label="Reset speech settings"
        >
          <RotateCcw size={15} />
          <span className="btn-icon-label">Reset</span>
        </button>
      </div>

      {/* Voice Character Presets */}
      <div className="presets-quick-bar">
        <span className="preset-bar-title">
          <Wand2 size={13} />
          <span>Acoustic Presets:</span>
        </span>
        <div className="preset-pills-list">
          <button
            type="button"
            className={`preset-pill ${pitch < 0.95 ? 'active-preset' : ''}`}
            onClick={() => applyPreset(0.85, 1.0)}
            disabled={disabled}
            title="Deeper pitch suitable for masculine/man speech"
          >
            👨 Man / Deep
          </button>
          <button
            type="button"
            className={`preset-pill ${pitch > 1.05 ? 'active-preset' : ''}`}
            onClick={() => applyPreset(1.15, 1.0)}
            disabled={disabled}
            title="Higher natural pitch suitable for feminine/woman speech"
          >
            👩 Woman / Clear
          </button>
          <button
            type="button"
            className={`preset-pill ${pitch === 1.0 && speed === 1.0 ? 'active-preset' : ''}`}
            onClick={() => applyPreset(1.0, 1.0)}
            disabled={disabled}
            title="Default balanced acoustic parameters"
          >
            🎙️ Balanced (1.0)
          </button>
        </div>
      </div>

      <div className="settings-grid">
        {/* Playback Speed */}
        <div className="setting-control">
          <div className="setting-header">
            <span className="setting-label">
              <Gauge size={15} className="setting-icon" />
              <span>Speed (Rate)</span>
            </span>
            <span className="setting-value-badge">{Number(speed).toFixed(2)}x</span>
          </div>
          <div className="range-wrapper">
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              disabled={disabled}
              className="range-slider"
              aria-label="Speech speed"
            />
          </div>
          <div className="range-scale-labels">
            <span>0.5x (Slow)</span>
            <span>1.0x (Normal)</span>
            <span>2.0x (Fast)</span>
          </div>
        </div>

        {/* Pitch */}
        <div className="setting-control">
          <div className="setting-header">
            <span className="setting-label">
              <Sliders size={15} className="setting-icon" />
              <span>Pitch (Vocal Tone)</span>
            </span>
            <span className="setting-value-badge">{Number(pitch).toFixed(2)}</span>
          </div>
          <div className="range-wrapper">
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={pitch}
              onChange={(e) => onPitchChange(parseFloat(e.target.value))}
              disabled={disabled}
              className="range-slider"
              aria-label="Speech pitch"
            />
          </div>
          <div className="range-scale-labels">
            <span>0.5 (Deeper / Man)</span>
            <span>1.0 (Natural)</span>
            <span>2.0 (Higher / Woman)</span>
          </div>
        </div>

        {/* Volume */}
        <div className="setting-control">
          <div className="setting-header">
            <span className="setting-label">
              <Volume2 size={15} className="setting-icon" />
              <span>Volume</span>
            </span>
            <span className="setting-value-badge">{Math.round(volume * 100)}%</span>
          </div>
          <div className="range-wrapper">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              disabled={disabled}
              className="range-slider"
              aria-label="Speech volume"
            />
          </div>
          <div className="range-scale-labels">
            <span>0% (Mute)</span>
            <span>50%</span>
            <span>100% (Max)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechSettings;
