import React, { useState } from 'react';
import { Copy, Trash2, Check, FileText, Sparkles } from 'lucide-react';
import TextStats from './TextStats';

const SAMPLE_TEXTS = [
  {
    label: '✨ Welcome Sample',
    text: 'Welcome to Text to Speech Studio! Both male and female voices are ready to convert your words into lifelike audio with crystal clarity.'
  },
  {
    label: '🎙️ Man Voice Sample',
    text: 'Good evening, everyone. This is a broadcast demonstration of a clear, deep masculine voice. How does this vocal profile sound to you?'
  },
  {
    label: '🌸 Woman Voice Sample',
    text: 'Hello! Welcome to our speech studio. I am speaking in a bright, expressive feminine voice. You can adjust my speed, pitch, and volume at any time!'
  }
];

const TextInput = ({
  text,
  onChange,
  onClear,
  maxLimit = 5000,
  speed = 1.0,
  disabled = false
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="card text-input-card">
      <div className="card-header">
        <div className="card-title-group">
          <FileText size={20} className="card-title-icon" />
          <h2 className="card-title">Enter Your Text</h2>
        </div>
        <div className="card-actions">
          <button
            type="button"
            className="btn-icon"
            onClick={handleCopy}
            disabled={!text}
            title={copied ? 'Copied!' : 'Copy text to clipboard'}
            aria-label="Copy text"
          >
            {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
            <span className="btn-icon-label">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            className="btn-icon btn-icon-danger"
            onClick={onClear}
            disabled={!text || disabled}
            title="Clear all text"
            aria-label="Clear text"
          >
            <Trash2 size={16} />
            <span className="btn-icon-label">Clear</span>
          </button>
        </div>
      </div>

      {/* Quick Sample Prompts Bar */}
      <div className="quick-samples-bar">
        <span className="sample-bar-tag">Quick Samples:</span>
        <div className="samples-list">
          {SAMPLE_TEXTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              className="sample-prompt-chip"
              onClick={() => onChange(sample.text)}
              disabled={disabled}
              title="Click to insert this text"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <div className="textarea-container">
        <textarea
          id="tts-text-input"
          className="tts-textarea"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter or paste the text you want to convert into speech..."
          rows={7}
          maxLength={maxLimit}
          disabled={disabled}
          spellCheck="true"
        />
      </div>

      <TextStats text={text} speed={speed} maxLimit={maxLimit} />
    </div>
  );
};

export default TextInput;
