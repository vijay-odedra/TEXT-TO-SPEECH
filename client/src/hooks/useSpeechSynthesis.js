import { useState, useEffect, useRef, useCallback } from 'react';
import { KNOWN_LANGUAGES, getPreviewPhrase } from '../utils/formatters';

export const useSpeechSynthesis = () => {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const [voices, setVoices] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [selectedVoice, setSelectedVoice] = useState(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [error, setError] = useState(null);

  // References to preserve state in event listeners
  const currentUtteranceRef = useRef(null);
  const lastSpeakConfigRef = useRef(null);
  const keepAliveTimerRef = useRef(null);

  // Chromium bug workaround: speech synthesis can stop after 15 seconds if unkept
  const startKeepAlive = () => {
    stopKeepAlive();
    keepAliveTimerRef.current = setInterval(() => {
      if (window.speechSynthesis && window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);
  };

  const stopKeepAlive = () => {
    if (keepAliveTimerRef.current) {
      clearInterval(keepAliveTimerRef.current);
      keepAliveTimerRef.current = null;
    }
  };

  // Populate dynamic voices from browser
  const populateVoices = useCallback(() => {
    if (!isSupported) return;

    try {
      const availableVoices = window.speechSynthesis.getVoices();
      if (!availableVoices || availableVoices.length === 0) {
        return;
      }

      setVoices(availableVoices);

      // Extract unique languages present in actual browser voices
      const uniqueLangs = Array.from(
        new Set(availableVoices.map((v) => v.lang.replace('_', '-')))
      ).sort();

      setLanguages(uniqueLangs);

      // If current selected voice is not valid anymore, pick a voice matching selectedLanguage or default
      setSelectedVoice((prevVoice) => {
        if (prevVoice && availableVoices.some((v) => v.voiceURI === prevVoice.voiceURI)) {
          return prevVoice;
        }

        // Try to match selectedLanguage
        const match = availableVoices.find(
          (v) => v.lang.replace('_', '-').toLowerCase() === selectedLanguage.toLowerCase()
        ) || availableVoices.find(
          (v) => v.lang.split(/[-_]/)[0].toLowerCase() === selectedLanguage.split(/[-_]/)[0].toLowerCase()
        ) || availableVoices.find((v) => v.default) || availableVoices[0];

        return match || null;
      });
    } catch (err) {
      console.error('Error fetching browser voices:', err);
      setError('Unable to load browser voices.');
    }
  }, [isSupported, selectedLanguage]);

  // Initial voices loading and listener for `onvoiceschanged`
  useEffect(() => {
    if (!isSupported) {
      setError('Web Speech API is not supported in this browser. Please use a modern browser like Chrome, Edge, or Firefox.');
      return;
    }

    populateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoices;
    }

    return () => {
      stopKeepAlive();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported, populateVoices]);

  // When selectedLanguage changes, pick a suitable voice for that language
  useEffect(() => {
    if (!voices.length) return;

    const langVoices = voices.filter(
      (v) => v.lang.replace('_', '-').toLowerCase() === selectedLanguage.toLowerCase()
    );

    if (langVoices.length > 0) {
      // Keep previous voice if it matches language, else select first or default
      setSelectedVoice((prev) => {
        if (prev && langVoices.some((v) => v.voiceURI === prev.voiceURI)) {
          return prev;
        }
        return langVoices.find((v) => v.default) || langVoices[0];
      });
    } else {
      // Check prefix match (e.g. "en", "hi", "gu", "mr")
      const prefix = selectedLanguage.split(/[-_]/)[0].toLowerCase();
      const prefixVoices = voices.filter(
        (v) => v.lang.split(/[-_]/)[0].toLowerCase() === prefix
      );
      if (prefixVoices.length > 0) {
        setSelectedVoice((prev) => {
          if (prev && prefixVoices.some((v) => v.voiceURI === prev.voiceURI)) {
            return prev;
          }
          return prefixVoices[0];
        });
      }
    }
  }, [selectedLanguage, voices]);

  // Stop any active speech
  const stop = useCallback(() => {
    if (!isSupported) return;
    stopKeepAlive();
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setIsPreviewing(false);
    currentUtteranceRef.current = null;
  }, [isSupported]);

  // Pause active speech
  const pause = useCallback(() => {
    if (!isSupported) return;
    try {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } catch (e) {
      console.error('Pause failed:', e);
    }
  }, [isSupported]);

  // Resume paused speech
  const resume = useCallback(() => {
    if (!isSupported) return;
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      }
    } catch (e) {
      console.error('Resume failed:', e);
    }
  }, [isSupported]);

  // Speak text with specified options
  const speak = useCallback(
    (text, options = {}) => {
      if (!isSupported) {
        setError('Web Speech API is not available.');
        return false;
      }

      if (!text || !text.trim()) {
        setError('Please provide text to speak.');
        return false;
      }

      // Stop any prior speech
      stop();

      const {
        voice = selectedVoice,
        language = selectedLanguage,
        speed = 1.0,
        pitch = 1.0,
        volume = 1.0
      } = options;

      // Save config for restart
      lastSpeakConfigRef.current = { text, options };

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        if (voice) {
          utterance.voice = voice;
        }
        utterance.lang = language || voice?.lang || 'en-US';
        utterance.rate = Math.max(0.5, Math.min(2.0, speed));
        utterance.pitch = Math.max(0.5, Math.min(2.0, pitch));
        utterance.volume = Math.max(0, Math.min(1.0, volume));

        utterance.onstart = () => {
          setIsSpeaking(true);
          setIsPaused(false);
          setError(null);
          startKeepAlive();
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          setIsPaused(false);
          stopKeepAlive();
          currentUtteranceRef.current = null;
        };

        utterance.onerror = (event) => {
          // 'canceled' is fired when user deliberately stops
          if (event.error !== 'canceled' && event.error !== 'interrupted') {
            console.error('Speech synthesis utterance error:', event.error);
            setError(`Speech playback error: ${event.error}`);
          }
          setIsSpeaking(false);
          setIsPaused(false);
          stopKeepAlive();
          currentUtteranceRef.current = null;
        };

        currentUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        return true;
      } catch (err) {
        console.error('Speech synthesis initiation error:', err);
        setError('Failed to begin speech playback.');
        setIsSpeaking(false);
        setIsPaused(false);
        return false;
      }
    },
    [isSupported, selectedVoice, selectedLanguage, stop]
  );

  // Restart speech from the beginning using last config
  const restart = useCallback(() => {
    if (lastSpeakConfigRef.current) {
      const { text, options } = lastSpeakConfigRef.current;
      speak(text, options);
    }
  }, [speak]);

  // Preview a specific voice with a short sample phrase
  const previewVoice = useCallback(
    (voice) => {
      if (!isSupported || !voice) return;

      // Stop any active speech or preview
      stop();

      const sampleText = getPreviewPhrase(voice.lang);

      try {
        const utterance = new SpeechSynthesisUtterance(sampleText);
        utterance.voice = voice;
        utterance.lang = voice.lang;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        setIsPreviewing(true);

        utterance.onend = () => {
          setIsPreviewing(false);
        };

        utterance.onerror = (e) => {
          if (e.error !== 'canceled' && e.error !== 'interrupted') {
            setError(`Voice preview error: ${e.error}`);
          }
          setIsPreviewing(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('Preview error:', err);
        setIsPreviewing(false);
      }
    },
    [isSupported, stop]
  );

  return {
    isSupported,
    voices,
    languages,
    selectedLanguage,
    setSelectedLanguage,
    selectedVoice,
    setSelectedVoice,
    isSpeaking,
    isPaused,
    isPreviewing,
    error,
    setError,
    speak,
    pause,
    resume,
    stop,
    restart,
    previewVoice
  };
};
