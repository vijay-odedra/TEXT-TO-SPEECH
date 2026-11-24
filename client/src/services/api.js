import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Checks backend health
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/api/health');
    return {
      connected: true,
      data: response.data
    };
  } catch (error) {
    return {
      connected: false,
      error: error.response?.data?.error?.message || error.message || 'Cannot connect to backend server'
    };
  }
};

/**
 * Gets active provider status from backend
 */
export const getBackendStatus = async () => {
  try {
    const response = await apiClient.get('/api/status');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || error.message);
  }
};

/**
 * Gets voices from backend provider
 */
export const getBackendVoices = async () => {
  try {
    const response = await apiClient.get('/api/voices');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || error.message);
  }
};

/**
 * Synthesizes audio through backend
 * If provider produces audio buffer, returns a Blob and object URL.
 * If provider is browser mode, returns structured info so frontend falls back cleanly.
 */
export const synthesizeBackendAudio = async ({ text, language, voice, speed, pitch, volume }) => {
  try {
    const response = await apiClient.post(
      '/api/tts',
      { text, language, voice, speed, pitch, volume },
      {
        responseType: 'blob'
      }
    );

    const contentType = response.headers['content-type'] || '';

    // If backend returned JSON (e.g. browser notice or unconfigured response returned as blob)
    if (contentType.includes('application/json')) {
      const textData = await response.data.text();
      const jsonData = JSON.parse(textData);
      return {
        isAudioBlob: false,
        data: jsonData
      };
    }

    // Real audio blob (e.g. audio/mpeg, audio/wav)
    const blob = new Blob([response.data], { type: contentType || 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(blob);

    return {
      isAudioBlob: true,
      blob,
      audioUrl,
      contentType
    };
  } catch (error) {
    if (error.response && error.response.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        const parsed = JSON.parse(errorText);
        throw new Error(parsed.error?.message || parsed.message || 'Speech synthesis failed');
      } catch (parseErr) {
        throw new Error(error.message || 'Speech synthesis failed');
      }
    }
    throw new Error(error.response?.data?.error?.message || error.message || 'Speech synthesis network error');
  }
};

export default {
  checkHealth,
  getBackendStatus,
  getBackendVoices,
  synthesizeBackendAudio
};
