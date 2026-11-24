import React from 'react';
import { Sparkles, Loader2, Volume2 } from 'lucide-react';

const GenerateButton = ({ onGenerate, isGenerating, disabled, textLength = 0 }) => {
  return (
    <div className="generate-action-container">
      <button
        type="button"
        className="btn-generate"
        onClick={onGenerate}
        disabled={disabled || isGenerating || textLength === 0}
        title={textLength === 0 ? 'Please enter some text first' : 'Generate and start speech synthesis'}
        aria-label="Generate speech"
      >
        {isGenerating ? (
          <>
            <Loader2 size={22} className="spin" />
            <span>Generating Speech...</span>
          </>
        ) : (
          <>
            <Sparkles size={22} />
            <span>Generate &amp; Speak</span>
          </>
        )}
      </button>
      {textLength === 0 && (
        <p className="btn-helper-hint">Type or upload text above to enable speech generation</p>
      )}
    </div>
  );
};

export default GenerateButton;
