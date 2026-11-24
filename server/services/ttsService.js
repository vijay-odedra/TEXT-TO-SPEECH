const browserFallbackProvider = require('./providers/browserFallbackProvider');
const freeTtsProvider = require('./providers/freeTtsProvider');
const openAiTtsProvider = require('./providers/openAiTtsProvider');
const elevenLabsTtsProvider = require('./providers/elevenLabsTtsProvider');
const logger = require('../utils/logger');

class TtsService {
  constructor() {
    this.providers = {
      browser: freeTtsProvider, // Uses real free MP3 audio synthesis for downloads
      free: freeTtsProvider,
      openai: openAiTtsProvider,
      elevenlabs: elevenLabsTtsProvider
    };
  }

  getActiveProviderName() {
    const raw = (process.env.TTS_PROVIDER || 'browser').toLowerCase().trim();
    if (this.providers[raw]) {
      return raw;
    }
    return 'browser';
  }

  getActiveProvider() {
    const name = this.getActiveProviderName();
    const provider = this.providers[name];

    // If openai or elevenlabs is chosen but not configured, fallback to freeTtsProvider
    if (provider && typeof provider.isConfigured === 'function' && !provider.isConfigured()) {
      return freeTtsProvider;
    }

    return provider || freeTtsProvider;
  }

  getStatus() {
    const activeName = this.getActiveProviderName();
    return {
      activeProvider: activeName,
      isConfigured: true,
      audioDownloadSupported: true,
      availableProviders: Object.keys(this.providers)
    };
  }

  async getVoices() {
    const provider = this.getActiveProvider();
    return await provider.getVoices();
  }

  async synthesize(params) {
    const provider = this.getActiveProvider();
    logger.info(`Synthesizing speech audio`, {
      textLength: params.text?.length,
      language: params.language
    });
    return await provider.synthesize(params);
  }
}

module.exports = new TtsService();
