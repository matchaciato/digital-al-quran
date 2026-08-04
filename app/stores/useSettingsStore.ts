import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { QURAN_API } from '~/constants/quran';

export type ReadingMode = 'verse' | 'page';

export const useSettingsStore = defineStore('settings', () => {
  const arabicFontSize = useLocalStorage<number>('quran_arabic_font_size', 28);
  const translationFontSize = useLocalStorage<number>('quran_translation_font_size', 16);
  const showLatin = useLocalStorage<boolean>('quran_show_latin', true);
  const showTranslation = useLocalStorage<boolean>('quran_show_translation', true);
  const selectedReciterId = useLocalStorage<number>('quran_reciter_id', QURAN_API.DEFAULT_RECITER_ID);
  const selectedTafsirId = useLocalStorage<number>('quran_tafsir_id', 168);
  const readingMode = useLocalStorage<ReadingMode>('quran_reading_mode', 'verse');
  const isDarkMode = useLocalStorage<boolean>('quran_dark_mode', false);

  const setArabicFontSize = (size: number) => {
    arabicFontSize.value = Math.min(50, Math.max(16, size));
  };

  const setTranslationFontSize = (size: number) => {
    translationFontSize.value = Math.min(30, Math.max(12, size));
  };

  const toggleLatin = () => {
    showLatin.value = !showLatin.value;
  };

  const toggleTranslation = () => {
    showTranslation.value = !showTranslation.value;
  };

  const setReciterId = (id: number) => {
    if (id > 0) {
      selectedReciterId.value = id;
    }
  };

  const setTafsirId = (id: number) => {
    if (id > 0) {
      selectedTafsirId.value = id;
    }
  };

  const setReadingMode = (mode: ReadingMode) => {
    readingMode.value = mode;
  };

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
  };

  return {
    arabicFontSize,
    translationFontSize,
    showLatin,
    showTranslation,
    selectedReciterId,
    selectedTafsirId,
    readingMode,
    isDarkMode,
    setArabicFontSize,
    setTranslationFontSize,
    toggleLatin,
    toggleTranslation,
    setReciterId,
    setTafsirId,
    setReadingMode,
    toggleDarkMode
  };
});
