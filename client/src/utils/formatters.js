/**
 * Language and Voice Formatting Utilities
 */

export const KNOWN_LANGUAGES = [
  { code: 'en-US', name: 'English (United States)', preview: 'Hello! This is a preview of this voice.' },
  { code: 'en-GB', name: 'English (United Kingdom)', preview: 'Greetings! This is a preview of this voice.' },
  { code: 'hi-IN', name: 'Hindi (India)', preview: 'नमस्ते! यह इस आवाज़ का एक नमूना है।' },
  { code: 'gu-IN', name: 'Gujarati (India)', preview: 'નમસ્તે! આ આ અવાજનો એક નમૂનો છે.' },
  { code: 'mr-IN', name: 'Marathi (India)', preview: 'नमस्कार! हा या आवाजाचा नमुना आहे.' },
  { code: 'es-ES', name: 'Spanish (Spain)', preview: '¡Hola! Esta es una vista previa de esta voz.' },
  { code: 'fr-FR', name: 'French (France)', preview: 'Bonjour! Ceci est un aperçu de cette voix.' },
  { code: 'de-DE', name: 'German (Germany)', preview: 'Hallo! Dies ist eine Vorschau dieser Stimme.' },
  { code: 'it-IT', name: 'Italian (Italy)', preview: 'Ciao! Questa è un\'anteprima di questa voce.' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', preview: 'Olá! Esta é uma prévia desta voz.' },
  { code: 'ja-JP', name: 'Japanese (Japan)', preview: 'こんにちは！これはこの音声のプレビューです。' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)', preview: '你好！这是此语音的预览。' }
];

/**
 * Returns a human-friendly label for a language code (e.g. "en-US" or "hi")
 */
export const getLanguageLabel = (langCode) => {
  if (!langCode) return 'Unknown Language';
  const cleanCode = langCode.replace('_', '-');

  // Exact match
  const found = KNOWN_LANGUAGES.find(
    (l) => l.code.toLowerCase() === cleanCode.toLowerCase()
  );
  if (found) return found.name;

  // Prefix match (e.g. "hi" matches "hi-IN", "gu" matches "gu-IN")
  const prefix = cleanCode.split('-')[0].toLowerCase();
  const prefixMatch = KNOWN_LANGUAGES.find(
    (l) => l.code.split('-')[0].toLowerCase() === prefix
  );
  if (prefixMatch) {
    return `${prefixMatch.name.split(' (')[0]} (${cleanCode})`;
  }

  // Fallback to Intl.DisplayNames if available in browser
  try {
    const intlNames = new Intl.DisplayNames(['en'], { type: 'language' });
    const name = intlNames.of(cleanCode);
    if (name) return `${name} (${cleanCode})`;
  } catch (e) {
    // ignore
  }

  return cleanCode;
};

/**
 * Common male and female name patterns for reliable gender detection
 */
const MALE_NAMES_REGEX = /\b(david|mark|george|guy|ravi|hemant|james|richard|paul|stefan|pablo|raul|guillermo|alain|claude|liam|daniel|oliver|arthur|sean|michael|john|thomas|robert|christopher|matthew|william|joseph|brian|kevin|ryan|eric|jacob|nicholas|jonathan|brandon|justin|tyler|alexander|noah|ethan|lucas|logan|mason|benjamin|henry|jack|harry|charlie|alloy|echo|onyx|fable|male|man|boy)\b/i;

const FEMALE_NAMES_REGEX = /\b(zira|hazel|susan|heera|kalpana|jenny|aria|sara|samantha|victoria|karen|moira|fiona|tessa|veena|neerja|swara|ananya|shruti|pooja|sunita|amira|salma|hortense|julie|celine|marie|hedda|katja|marlene|vicki|elsa|alice|emma|olivia|ava|sophia|isabella|mia|charlotte|amelia|harper|nova|shimmer|rachel|female|woman|girl|lady)\b/i;

/**
 * Detects voice gender reliably from name, voiceURI, or metadata
 * Returns 'male', 'female', or 'unknown'
 */
export const detectVoiceGender = (voice) => {
  if (!voice) return 'unknown';

  // Check explicit gender property if present (some provider APIs)
  if (voice.gender) {
    const g = String(voice.gender).toLowerCase();
    if (g.includes('male') && !g.includes('female')) return 'male';
    if (g.includes('female')) return 'female';
  }

  const searchTarget = `${voice.name || ''} ${voice.voiceURI || ''}`;

  if (MALE_NAMES_REGEX.test(searchTarget)) {
    return 'male';
  }

  if (FEMALE_NAMES_REGEX.test(searchTarget)) {
    return 'female';
  }

  // Heuristic for Chrome Google voices: Google UK English Male vs Google US English (female)
  if (/google/i.test(searchTarget)) {
    if (/male/i.test(searchTarget)) return 'male';
    return 'female';
  }

  return 'unknown';
};

/**
 * Gets a sample preview phrase for a given language
 */
export const getPreviewPhrase = (langCode) => {
  if (!langCode) return 'Hello, this is a sample preview of the selected voice.';
  const cleanCode = langCode.replace('_', '-').toLowerCase();

  const found = KNOWN_LANGUAGES.find(
    (l) => l.code.toLowerCase() === cleanCode || l.code.split('-')[0].toLowerCase() === cleanCode.split('-')[0]
  );
  return found ? found.preview : 'Hello, this is a sample preview of the selected voice.';
};

/**
 * Formats file size in KB/MB
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
