/**
 * Validation Middleware for TTS Requests
 */
const MAX_CHAR_LIMIT = parseInt(process.env.MAX_TEXT_LENGTH, 10) || 5000;

const validateTTSRequest = (req, res, next) => {
  // Check Content-Type for POST requests with body
  const contentType = req.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_CONTENT_TYPE',
        message: 'Content-Type header must be application/json.'
      }
    });
  }

  const { text, language, voice, speed = 1, pitch = 1, volume = 1 } = req.body || {};

  // Validate text existence
  if (text === undefined || text === null) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'MISSING_TEXT',
        message: 'The "text" field is required.'
      }
    });
  }

  if (typeof text !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_TEXT_TYPE',
        message: 'The "text" field must be a string.'
      }
    });
  }

  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'EMPTY_TEXT',
        message: 'Text cannot be empty. Please enter or paste some text to convert.'
      }
    });
  }

  if (trimmedText.length > MAX_CHAR_LIMIT) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'TEXT_TOO_LONG',
        message: `Text exceeds the maximum allowed limit of ${MAX_CHAR_LIMIT} characters (received ${trimmedText.length}).`
      }
    });
  }

  // Validate language if provided
  if (language !== undefined && (typeof language !== 'string' || language.trim().length === 0)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_LANGUAGE',
        message: 'Language must be a valid non-empty language code string (e.g., "en-US", "hi-IN").'
      }
    });
  }

  // Validate voice if provided
  if (voice !== undefined && typeof voice !== 'string') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_VOICE',
        message: 'Voice must be a valid voice identifier string.'
      }
    });
  }

  // Validate speed (0.5 to 2.0)
  const numericSpeed = Number(speed);
  if (isNaN(numericSpeed) || numericSpeed < 0.5 || numericSpeed > 2.0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_SPEED',
        message: 'Speed must be a number between 0.5 and 2.0.'
      }
    });
  }

  // Validate pitch (0.5 to 2.0)
  const numericPitch = Number(pitch);
  if (isNaN(numericPitch) || numericPitch < 0.5 || numericPitch > 2.0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_PITCH',
        message: 'Pitch must be a number between 0.5 and 2.0.'
      }
    });
  }

  // Validate volume (0.0 to 1.0)
  const numericVolume = Number(volume);
  if (isNaN(numericVolume) || numericVolume < 0 || numericVolume > 1.0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_VOLUME',
        message: 'Volume must be a number between 0 and 1.0.'
      }
    });
  }

  // Attach sanitized params
  req.sanitizedTTS = {
    text: trimmedText,
    language: language ? language.trim() : 'en-US',
    voice: voice ? voice.trim() : null,
    speed: numericSpeed,
    pitch: numericPitch,
    volume: numericVolume
  };

  next();
};

module.exports = {
  validateTTSRequest,
  MAX_CHAR_LIMIT
};
