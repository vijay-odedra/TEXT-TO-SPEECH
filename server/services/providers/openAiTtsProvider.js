const logger = require('../../utils/logger');

/**
 * OpenAI TTS Provider (Modular)
 */
class OpenAiTtsProvider {
  constructor() {
    this.name = 'openai';
    this.apiKey = process.env.TTS_API_KEY || '';
    this.endpoint = process.env.TTS_ENDPOINT || 'https://api.openai.com/v1/audio/speech';
    this.model = process.env.TTS_MODEL || 'tts-1';
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async getVoices() {
    return {
      provider: 'openai',
      clientDriven: false,
      voices: [
        { id: 'alloy', name: 'Alloy', language: 'en-US', gender: 'neutral' },
        { id: 'echo', name: 'Echo', language: 'en-US', gender: 'male' },
        { id: 'fable', name: 'Fable', language: 'en-GB', gender: 'male' },
        { id: 'onyx', name: 'Onyx', language: 'en-US', gender: 'male' },
        { id: 'nova', name: 'Nova', language: 'en-US', gender: 'female' },
        { id: 'shimmer', name: 'Shimmer', language: 'en-US', gender: 'female' }
      ]
    };
  }

  async synthesize({ text, voice, speed = 1.0 }) {
    if (!this.isConfigured()) {
      return {
        success: false,
        isConfigured: false,
        code: 'MISSING_API_KEY',
        message: 'OpenAI TTS is selected but TTS_API_KEY is not configured in server/.env.'
      };
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          input: text,
          voice: voice || 'alloy',
          speed: Math.max(0.25, Math.min(4.0, speed))
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`OpenAI TTS Error (${response.status}):`, errorText);
        return {
          success: false,
          code: 'PROVIDER_API_ERROR',
          message: `OpenAI TTS API returned status ${response.status}: ${errorText}`
        };
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return {
        success: true,
        buffer,
        contentType: 'audio/mpeg',
        format: 'mp3',
        filename: `speech_${Date.now()}.mp3`
      };
    } catch (err) {
      logger.error('OpenAI TTS synthesis exception:', err);
      return {
        success: false,
        code: 'PROVIDER_NETWORK_ERROR',
        message: `Failed to contact OpenAI TTS service: ${err.message}`
      };
    }
  }
}

module.exports = new OpenAiTtsProvider();
