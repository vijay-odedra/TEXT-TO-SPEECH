import React, { useState, useMemo } from 'react';
import { Mic, User, Users } from 'lucide-react';
import VoicePreview from './VoicePreview';
import { detectVoiceGender } from '../utils/formatters';

const VoiceSelector = ({
  voices = [],
  selectedLanguage,
  selectedVoice,
  onChange,
  onPreview,
  onStopPreview,
  isPreviewing,
  onGenderQuickSelect,
  disabled = false
}) => {
  const [genderFilter, setGenderFilter] = useState('all'); // 'all' | 'male' | 'female'

  // Filter voices that match the currently selected language
  const languageVoices = useMemo(() => {
    if (!voices || voices.length === 0) return [];

    const exactMatches = voices.filter(
      (v) => v.lang.replace('_', '-').toLowerCase() === selectedLanguage.toLowerCase()
    );

    if (exactMatches.length > 0) return exactMatches;

    // Fall back to prefix matching (e.g. "en" matches "en-US", "en-GB")
    const prefix = selectedLanguage.split(/[-_]/)[0].toLowerCase();
    const prefixMatches = voices.filter(
      (v) => v.lang.split(/[-_]/)[0].toLowerCase() === prefix
    );

    return prefixMatches.length > 0 ? prefixMatches : voices;
  }, [voices, selectedLanguage]);

  // Count male and female voices available for current language
  const { maleCount, femaleCount } = useMemo(() => {
    let m = 0;
    let f = 0;
    languageVoices.forEach((v) => {
      const g = detectVoiceGender(v);
      if (g === 'male') m++;
      else if (g === 'female') f++;
    });
    return { maleCount: m, femaleCount: f };
  }, [languageVoices]);

  // Filter by selected gender tab
  const displayedVoices = useMemo(() => {
    if (genderFilter === 'all') return languageVoices;
    const filtered = languageVoices.filter((v) => detectVoiceGender(v) === genderFilter);
    // If no voice matches specific filter, don't leave empty: fallback to all
    return filtered.length > 0 ? filtered : languageVoices;
  }, [languageVoices, genderFilter]);

  // Handle switching gender filter
  const handleGenderFilterChange = (newGender) => {
    setGenderFilter(newGender);
    if (isPreviewing && onStopPreview) {
      onStopPreview();
    }

    if (newGender === 'all') return;

    // Automatically switch to the best voice of that gender
    const match = languageVoices.find((v) => detectVoiceGender(v) === newGender);
    if (match && match.voiceURI !== selectedVoice?.voiceURI) {
      onChange(match);
      if (onGenderQuickSelect) {
        onGenderQuickSelect(newGender, match);
      }
    }
  };

  const handleVoiceChange = (e) => {
    if (isPreviewing && onStopPreview) {
      onStopPreview();
    }
    const voiceUri = e.target.value;
    const voice = voices.find((v) => (v.voiceURI || v.name) === voiceUri);
    if (voice) {
      onChange(voice);
    }
  };

  const currentGender = detectVoiceGender(selectedVoice);

  const getVoiceDisplay = (v) => {
    const gender = detectVoiceGender(v);
    const genderIcon = gender === 'male' ? '👨 [Man]' : gender === 'female' ? '👩 [Woman]' : '🎙️ [Voice]';
    const isLocal = v.localService ? ' (Device)' : ' (Cloud/HD)';
    const isDef = v.default ? ' ★' : '';
    return `${genderIcon} ${v.name}${isDef}${isLocal}`;
  };

  return (
    <div className="form-group voice-selector-group">
      <div className="form-label-with-action">
        <label htmlFor="voice-select" className="form-label">
          <Mic size={16} className="form-label-icon" />
          <span>Select Voice</span>
          <span className="badge-count">
            {displayedVoices.length} {displayedVoices.length === 1 ? 'voice' : 'voices'}
          </span>
        </label>
        <VoicePreview
          selectedVoice={selectedVoice}
          isPreviewing={isPreviewing}
          onPreview={onPreview}
          onStop={onStopPreview}
          disabled={disabled || !selectedVoice}
        />
      </div>

      {/* Gender Quick-Select Tabs */}
      <div className="gender-segmented-bar" role="group" aria-label="Filter voice gender">
        <button
          type="button"
          className={`gender-tab-btn ${genderFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleGenderFilterChange('all')}
          disabled={disabled}
        >
          <Users size={14} />
          <span>All ({languageVoices.length})</span>
        </button>

        <button
          type="button"
          className={`gender-tab-btn male ${genderFilter === 'male' || currentGender === 'male' ? 'active' : ''}`}
          onClick={() => handleGenderFilterChange('male')}
          disabled={disabled}
          title="Select a Male / Man voice"
        >
          <span className="gender-avatar">👨</span>
          <span>Man / Male</span>
          {maleCount > 0 && <span className="gender-count-pill">{maleCount}</span>}
        </button>

        <button
          type="button"
          className={`gender-tab-btn female ${genderFilter === 'female' || currentGender === 'female' ? 'active' : ''}`}
          onClick={() => handleGenderFilterChange('female')}
          disabled={disabled}
          title="Select a Female / Woman voice"
        >
          <span className="gender-avatar">👩</span>
          <span>Woman / Female</span>
          {femaleCount > 0 && <span className="gender-count-pill">{femaleCount}</span>}
        </button>
      </div>

      {/* Voice Dropdown */}
      <div className="select-wrapper">
        <select
          id="voice-select"
          className="form-select voice-dropdown-enhanced"
          value={selectedVoice?.voiceURI || selectedVoice?.name || ''}
          onChange={handleVoiceChange}
          disabled={disabled || displayedVoices.length === 0}
        >
          {displayedVoices.map((voice) => (
            <option key={voice.voiceURI || voice.name} value={voice.voiceURI || voice.name}>
              {getVoiceDisplay(voice)}
            </option>
          ))}
          {displayedVoices.length === 0 && (
            <option value="" disabled>
              No voices found for this selection
            </option>
          )}
        </select>
      </div>

      {/* Active Voice Pill Info */}
      {selectedVoice && (
        <div className="selected-voice-meta-pill">
          <span className="meta-badge-gender">
            {currentGender === 'male' ? '👨 Man (Male Voice)' : currentGender === 'female' ? '👩 Woman (Female Voice)' : '🎙️ Natural Voice'}
          </span>
          <span className="meta-badge-name">{selectedVoice.name}</span>
          <span className="meta-badge-lang">{selectedVoice.lang}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceSelector;
