const logger = require('../../utils/logger');

/**
 * ElevenLabs TTS Provider (Modular)
 */
class ElevenLabsTtsProvider {
  constructor() {
    this.name = 'elevenlabs';
    this.apiKey = process.env.TTS_API_KEY || '';
    this.endpoint = process.env.TTS_ENDPOINT || 'https://api.elevenlabs.io/v1/text-to-speech';
    this.defaultVoiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async getVoices() {
    if (!this.isConfigured()) {
      return {
        provider: 'elevenlabs',
        clientDriven: false,
        voices: [],
        message: 'ElevenLabs API key is not configured.'
      };
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': this.apiKey }
      });

      if (!response.ok) {
        return {
          provider: 'elevenlabs',
          voices: [],
          message: `Failed to fetch ElevenLabs voices (status ${response.status})`
        };
      }

      const data = await response.json();
      const voices = (data.voices || []).map(v => ({
        id: v.voice_id,
        name: v.name,
        language: v.labels?.accent || 'en',
        gender: v.labels?.gender || 'unknown'
      }));

      return {
        provider: 'elevenlabs',
        clientDriven: false,
        voices
      };
    } catch (err) {
      logger.error('ElevenLabs voices error:', err);
      return {
        provider: 'elevenlabs',
        voices: [],
        message: err.message
      };
    }
  }

  async synthesize({ text, voice }) {
    if (!this.isConfigured()) {
      return {
        success: false,
        isConfigured: false,
        code: 'MISSING_API_KEY',
        message: 'ElevenLabs TTS is selected but TTS_API_KEY is not configured in server/.env.'
      };
    }

    const voiceId = voice || this.defaultVoiceId;
    const url = `${this.endpoint}/${voiceId}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`ElevenLabs TTS Error (${response.status}):`, errorText);
        return {
          success: false,
          code: 'PROVIDER_API_ERROR',
          message: `ElevenLabs API error (${response.status}): ${errorText}`
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
      logger.error('ElevenLabs synthesis error:', err);
      return {
        success: false,
        code: 'PROVIDER_NETWORK_ERROR',
        message: `Failed to contact ElevenLabs service: ${err.message}`
      };
    }
  }
}

module.exports = new ElevenLabsTtsProvider();
