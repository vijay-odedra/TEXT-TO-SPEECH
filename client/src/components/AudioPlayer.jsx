import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Download, Volume2, VolumeX, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

const AudioPlayer = ({ audioUrl, contentType = 'audio/mpeg', onDownloadSuccess }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((err) => {
        console.error('Audio playback error:', err);
      });
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    try {
      const a = document.createElement('a');
      a.href = audioUrl;
      const extension = contentType.includes('wav') ? 'wav' : 'mp3';
      a.download = `speech-${Date.now()}.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadNotice('Audio file downloaded successfully!');
      setTimeout(() => setDownloadNotice(null), 3500);
      if (onDownloadSuccess) onDownloadSuccess();
    } catch (err) {
      console.error('Download error:', err);
      setDownloadNotice('Failed to download audio file.');
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) {
    return (
      <div className="card audio-player-card empty-state">
        <div className="audio-player-info">
          <AlertCircle size={20} className="info-icon" />
          <div className="info-text">
            <strong>Browser Speech Synthesis Engine Active</strong>
            <p>
              Speech is currently played directly through your device's audio hardware via the
              browser's Web Speech API. Direct audio file downloading (.mp3) is supported when
              an external backend TTS provider (e.g., OpenAI or ElevenLabs) is configured.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card audio-player-card">
      <div className="card-header">
        <div className="card-title-group">
          <Volume2 size={20} className="card-title-icon" />
          <h3 className="card-title">Generated Audio Track</h3>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={handleDownload}
          title="Download audio file"
          aria-label="Download generated audio"
        >
          <Download size={15} />
          <span>Download Audio</span>
        </button>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {downloadNotice && (
        <div className="audio-player-notice">
          <CheckCircle2 size={16} />
          <span>{downloadNotice}</span>
        </div>
      )}

      <div className="audio-player-controls">
        <button
          type="button"
          className="btn-circle play-pause-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause generated audio' : 'Play generated audio'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="play-icon-offset" />}
        </button>

        {/* Time display */}
        <span className="time-display current-time">{formatTime(currentTime)}</span>

        {/* Progress seeker */}
        <div className="seek-bar-wrapper">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="seek-slider"
            aria-label="Seek audio position"
          />
        </div>

        {/* Total Duration */}
        <span className="time-display total-duration">{formatTime(duration)}</span>

        {/* Volume */}
        <div className="volume-control-group">
          <button
            type="button"
            className="btn-icon-subtle"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label="Volume level"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
