/**
 * Browser Fallback TTS Provider
 * When no external cloud provider credentials are configured, the system uses
 * the client browser's native Web Speech API (SpeechSynthesis).
 */
class BrowserFallbackProvider {
  constructor() {
    this.name = 'browser';
    this.isConfigured = true;
  }

  async getVoices() {
    return {
      provider: 'browser',
      clientDriven: true,
      voices: [],
      message: 'Browser Web Speech API voices are installed directly on the client operating system and are enumerated dynamically in the browser.'
    };
  }

  async synthesize(params) {
    // We do NOT fake audio buffers or pretend MP3 audio was generated.
    return {
      success: false,
      isConfigured: false,
      code: 'BROWSER_TTS_MODE',
      message: 'Server-side audio generation is not configured. The application uses client-side Web Speech API for high-quality, local zero-cost speech synthesis in the browser.',
      recommendation: 'Use the browser SpeechSynthesis engine or configure an external TTS provider (e.g. OpenAI, ElevenLabs, Google Cloud) in server/.env.'
    };
  }
}

module.exports = new BrowserFallbackProvider();
