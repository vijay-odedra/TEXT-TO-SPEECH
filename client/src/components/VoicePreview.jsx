import React from 'react';
import { Play, Volume2, Square } from 'lucide-react';

const VoicePreview = ({ selectedVoice, isPreviewing, onPreview, onStop, disabled }) => {
  return (
    <div className="voice-preview-container">
      {isPreviewing ? (
        <button
          type="button"
          className="btn btn-sm btn-secondary preview-active"
          onClick={onStop}
          title="Stop preview playback"
          aria-label="Stop preview playback"
        >
          <Square size={14} className="spin-slow" />
          <span>Stop Preview</span>
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => onPreview(selectedVoice)}
          disabled={!selectedVoice || disabled}
          title="Hear a brief sample of this voice"
          aria-label="Preview selected voice"
        >
          <Volume2 size={14} />
          <span>Preview Voice</span>
        </button>
      )}
    </div>
  );
};

export default VoicePreview;
