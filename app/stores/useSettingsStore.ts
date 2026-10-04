import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { QURAN_API } from '~/constants/quran';

export type ReadingMode = 'verse' | 'mushaf' | 'zen' | 'parallel';

export const useSettingsStore = defineStore('settings', () => {
  const arabicFontSize = useLocalStorage<number>('quran_arabic_font_size', 28);
  const translationFontSize = useLocalStorage<number>('quran_translation_font_size', 16);
  const showLatin = useLocalStorage<boolean>('quran_show_latin', true);
  const showTranslation = useLocalStorage<boolean>('quran_show_translation', true);
  const selectedReciterId = useLocalStorage<number>('quran_reciter_id', QURAN_API.DEFAULT_RECITER_ID);
  const selectedTafsirId = useLocalStorage<number>('quran_tafsir_id', 1);
  const readingMode = useLocalStorage<ReadingMode>('quran_reading_mode', 'verse');
  const isDarkMode = useLocalStorage<boolean>('quran_dark_mode', false);
  const isSettingsOpen = ref<boolean>(false);

  if (import.meta.client) {
    try {
      const isMigrated = localStorage.getItem('quran_tafsir_v2_migrated');
      if (!isMigrated) {
        if (selectedTafsirId.value === 168 || selectedTafsirId.value === 164 || selectedTafsirId.value === 171 || selectedTafsirId.value === 166) {
          selectedTafsirId.value = 1;
        }
        localStorage.setItem('quran_tafsir_v2_migrated', '1');
      }
    } catch {
      // Ignore localStorage access restrictions in private browsing
    }

    watch(isDarkMode, (dark) => {
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, { immediate: true });
  }

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

  const openSettings = () => {
    isSettingsOpen.value = true;
  };

  const closeSettings = () => {
    isSettingsOpen.value = false;
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
    isSettingsOpen,
    setArabicFontSize,
    setTranslationFontSize,
    toggleLatin,
    toggleTranslation,
    setReciterId,
    setTafsirId,
    setReadingMode,
    toggleDarkMode,
    openSettings,
    closeSettings
  };
});
