import React from 'react';
import { Globe } from 'lucide-react';
import { KNOWN_LANGUAGES, getLanguageLabel } from '../utils/formatters';

const LanguageSelector = ({
  languages = [],
  selectedLanguage,
  onChange,
  disabled = false
}) => {
  // Combine known priority languages with all detected system languages
  const languageOptions = React.useMemo(() => {
    // If languages list is empty (e.g. before voices load), show priority list
    if (!languages || languages.length === 0) {
      return KNOWN_LANGUAGES.map((l) => ({
        code: l.code,
        label: l.name,
        available: false
      }));
    }

    // Map system languages to friendly names
    const systemLangCodes = new Set(languages.map((l) => l.toLowerCase()));

    // Create unique combined list
    const seen = new Set();
    const result = [];

    // First, known languages that have voices installed
    KNOWN_LANGUAGES.forEach((known) => {
      const match = languages.find(
        (l) => l.toLowerCase() === known.code.toLowerCase() ||
               l.split(/[-_]/)[0].toLowerCase() === known.code.split(/[-_]/)[0].toLowerCase()
      );
      if (match && !seen.has(match.toLowerCase())) {
        seen.add(match.toLowerCase());
        result.push({
          code: match,
          label: `${known.name}`,
          isPriority: true
        });
      }
    });

    // Then, any other languages installed on user's system
    languages.forEach((langCode) => {
      if (!seen.has(langCode.toLowerCase())) {
        seen.add(langCode.toLowerCase());
        result.push({
          code: langCode,
          label: getLanguageLabel(langCode),
          isPriority: false
        });
      }
    });

    return result;
  }, [languages]);

  return (
    <div className="form-group">
      <label htmlFor="language-select" className="form-label">
        <Globe size={16} className="form-label-icon" />
        <span>Language</span>
        <span className="badge-count">{languageOptions.length} available</span>
      </label>

      <div className="select-wrapper">
        <select
          id="language-select"
          className="form-select"
          value={selectedLanguage}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || languageOptions.length === 0}
        >
          {languageOptions.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
