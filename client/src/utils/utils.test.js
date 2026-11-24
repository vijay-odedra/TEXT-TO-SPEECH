import test from 'node:test';
import assert from 'node:assert';
import { countWords, countCharacters, countCharactersNoSpaces, estimateDurationSeconds, formatDuration } from './textStats.js';
import { getLanguageLabel, getPreviewPhrase, formatFileSize, KNOWN_LANGUAGES, detectVoiceGender } from './formatters.js';

test('countWords should accurately count words in normal and multiline strings', () => {
  assert.strictEqual(countWords(''), 0);
  assert.strictEqual(countWords('   '), 0);
  assert.strictEqual(countWords('Hello world'), 2);
  assert.strictEqual(countWords('  Hello \n  world  \t from \n\n TTS  '), 4);
});

test('countCharacters should accurately count characters including spaces', () => {
  assert.strictEqual(countCharacters(''), 0);
  assert.strictEqual(countCharacters('Hello'), 5);
  assert.strictEqual(countCharacters('Hello World!'), 12);
});

test('countCharactersNoSpaces should ignore all whitespace', () => {
  assert.strictEqual(countCharactersNoSpaces('H e l l o'), 5);
  assert.strictEqual(countCharactersNoSpaces('  \n\t  '), 0);
});

test('estimateDurationSeconds should adjust duration based on speech rate', () => {
  // 140 words at 1.0x speed = 60s
  const text140 = Array(140).fill('word').join(' ');
  const durNormal = estimateDurationSeconds(text140, 1.0);
  assert.strictEqual(durNormal, 60);

  // 140 words at 2.0x speed = 30s
  const durFast = estimateDurationSeconds(text140, 2.0);
  assert.strictEqual(durFast, 30);

  // 140 words at 0.5x speed = 120s
  const durSlow = estimateDurationSeconds(text140, 0.5);
  assert.strictEqual(durSlow, 120);
});

test('formatDuration should format seconds into mm:ss or Xs', () => {
  assert.strictEqual(formatDuration(0), '0s');
  assert.strictEqual(formatDuration(45), '45s');
  assert.strictEqual(formatDuration(60), '1m 00s');
  assert.strictEqual(formatDuration(125), '2m 05s');
});

test('getLanguageLabel should identify known languages and fallback gracefully', () => {
  assert.strictEqual(getLanguageLabel('en-US'), 'English (United States)');
  assert.strictEqual(getLanguageLabel('hi-IN'), 'Hindi (India)');
  assert.strictEqual(getLanguageLabel('gu-IN'), 'Gujarati (India)');
  assert.strictEqual(getLanguageLabel('mr-IN'), 'Marathi (India)');
});

test('getPreviewPhrase should return a natural sentence in target language', () => {
  assert.ok(getPreviewPhrase('en-US').length > 5);
  assert.ok(getPreviewPhrase('hi-IN').includes('नमस्ते'));
  assert.ok(getPreviewPhrase('gu-IN').includes('નમસ્તે'));
});

test('formatFileSize should format bytes into KB or MB', () => {
  assert.strictEqual(formatFileSize(500), '500 B');
  assert.strictEqual(formatFileSize(2048), '2.0 KB');
  assert.strictEqual(formatFileSize(1048576), '1.00 MB');
});

test('detectVoiceGender should distinguish male and female voices accurately', () => {
  assert.strictEqual(detectVoiceGender({ name: 'Microsoft David Desktop - English (United States)' }), 'male');
  assert.strictEqual(detectVoiceGender({ name: 'Microsoft Mark - English (United States)' }), 'male');
  assert.strictEqual(detectVoiceGender({ name: 'Microsoft George' }), 'male');
  assert.strictEqual(detectVoiceGender({ name: 'Microsoft Zira Desktop - English (United States)' }), 'female');
  assert.strictEqual(detectVoiceGender({ name: 'Microsoft Hazel Desktop - English (Great Britain)' }), 'female');
  assert.strictEqual(detectVoiceGender({ name: 'Google UK English Male' }), 'male');
  assert.strictEqual(detectVoiceGender({ name: 'Google US English' }), 'female');
  assert.strictEqual(detectVoiceGender(null), 'unknown');
});
