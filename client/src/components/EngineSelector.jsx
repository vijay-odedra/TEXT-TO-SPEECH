import React from 'react';
import { Cpu, Cloud, Sparkles } from 'lucide-react';

const EngineSelector = ({ engine, onEngineChange, backendAvailable, providerName }) => {
  return (
    <div className="engine-selector-container">
      <div className="engine-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={engine === 'browser'}
          className={`engine-tab ${engine === 'browser' ? 'active' : ''}`}
          onClick={() => onEngineChange('browser')}
        >
          <Cpu size={16} />
          <span>Web Speech API (Browser Native)</span>
          <span className="engine-badge free">Free &amp; Offline</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={engine === 'backend'}
          className={`engine-tab ${engine === 'backend' ? 'active' : ''}`}
          onClick={() => onEngineChange('backend')}
        >
          <Cloud size={16} />
          <span>Backend TTS Engine</span>
          <span className={`engine-badge ${backendAvailable ? 'active' : 'info'}`}>
            {providerName ? providerName.toUpperCase() : 'Modular API'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default EngineSelector;
