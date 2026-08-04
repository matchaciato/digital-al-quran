export const QURAN_API = {
  DEFAULT_BASE_URL: 'https://api.quran.com/api/v4',
  DEFAULT_LANGUAGE: 'id',
  DEFAULT_TRANSLATION_ID: 33,
  DEFAULT_RECITER_ID: 7,
  DEFAULT_PER_PAGE: 50,
  MAX_PER_PAGE: 300,
  MIN_CHAPTER: 1,
  MAX_CHAPTER: 114,
  MIN_JUZ: 1,
  MAX_JUZ: 30,
  MIN_PAGE: 1,
  MAX_PAGE: 604,
  AUDIO_BASE_URL: 'https://audio.qurancdn.com/'
} as const;
