/**
 * Text Statistics and Speech Duration Utilities
 */

/**
 * Calculates word count by splitting on whitespace
 */
export const countWords = (text) => {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
};

/**
 * Calculates total character count
 */
export const countCharacters = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text.length;
};

/**
 * Calculates character count excluding whitespace
 */
export const countCharactersNoSpaces = (text) => {
  if (!text || typeof text !== 'string') return 0;
  return text.replace(/\s+/g, '').length;
};

/**
 * Estimates reading / speaking duration in seconds
 * Average conversational speech rate is approximately 140 words per minute at 1.0x speed
 */
export const estimateDurationSeconds = (text, speed = 1.0) => {
  const words = countWords(text);
  if (words === 0) return 0;
  const safeSpeed = Math.max(0.2, speed || 1.0);
  const wordsPerMinute = 140 * safeSpeed;
  const duration = (words / wordsPerMinute) * 60;
  return Math.round(duration);
};

/**
 * Formats seconds into human-readable duration (e.g., "1m 12s" or "45s")
 */
export const formatDuration = (totalSeconds) => {
  if (!totalSeconds || totalSeconds <= 0) return '0s';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) {
    return `${seconds}s`;
  }
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
};
