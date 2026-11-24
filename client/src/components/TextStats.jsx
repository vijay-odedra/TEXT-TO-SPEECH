import React from 'react';
import { Type, AlignLeft, Clock } from 'lucide-react';
import { countCharacters, countWords, estimateDurationSeconds, formatDuration } from '../utils/textStats';

const TextStats = ({ text, speed = 1.0, maxLimit = 5000 }) => {
  const chars = countCharacters(text);
  const words = countWords(text);
  const durationSec = estimateDurationSeconds(text, speed);
  const formattedDuration = formatDuration(durationSec);

  const isNearLimit = chars > maxLimit * 0.9;
  const isOverLimit = chars > maxLimit;

  return (
    <div className="text-stats-bar">
      <div className="stat-item">
        <Type size={16} className="stat-icon" />
        <span className="stat-label">Characters:</span>
        <span className={`stat-value ${isOverLimit ? 'limit-exceeded' : isNearLimit ? 'limit-warning' : ''}`}>
          {chars.toLocaleString()} / {maxLimit.toLocaleString()}
        </span>
      </div>

      <div className="stat-item">
        <AlignLeft size={16} className="stat-icon" />
        <span className="stat-label">Words:</span>
        <span className="stat-value">{words.toLocaleString()}</span>
      </div>

      <div className="stat-item">
        <Clock size={16} className="stat-icon" />
        <span className="stat-label">Est. Duration:</span>
        <span className="stat-value highlight">{formattedDuration}</span>
      </div>
    </div>
  );
};

export default TextStats;
