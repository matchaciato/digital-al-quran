import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { QURAN_API } from '~/constants/quran';

export interface QuranSettings {
  arabicFontSize: number;
  translationFontSize: number;
  showLatin: boolean;
  showTranslation: boolean;
  translationId: number;
  reciterId: number;
  autoScroll: boolean;
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = useLocalStorage<QuranSettings>('quran_settings', {
    arabicFontSize: 28,
    translationFontSize: 16,
    showLatin: true,
    showTranslation: true,
    translationId: QURAN_API.DEFAULT_TRANSLATION_ID,
    reciterId: QURAN_API.DEFAULT_RECITER_ID,
    autoScroll: true
  });

  const setArabicFontSize = (size: number) => {
    const clamped = Math.min(48, Math.max(18, Math.floor(Number(size) || 28)));
    settings.value.arabicFontSize = clamped;
  };

  const setTranslationFontSize = (size: number) => {
    const clamped = Math.min(28, Math.max(12, Math.floor(Number(size) || 16)));
    settings.value.translationFontSize = clamped;
  };

  const toggleLatin = () => {
    settings.value.showLatin = !settings.value.showLatin;
  };

  const toggleTranslation = () => {
    settings.value.showTranslation = !settings.value.showTranslation;
  };

  const setTranslationId = (id: number) => {
    const valid = Math.floor(Number(id));
    if (!isNaN(valid) && valid > 0) {
      settings.value.translationId = valid;
    }
  };

  const setReciterId = (id: number) => {
    const valid = Math.floor(Number(id));
    if (!isNaN(valid) && valid > 0) {
      settings.value.reciterId = valid;
    }
  };

  const toggleAutoScroll = () => {
    settings.value.autoScroll = !settings.value.autoScroll;
  };

  const resetSettings = () => {
    settings.value = {
      arabicFontSize: 28,
      translationFontSize: 16,
      showLatin: true,
      showTranslation: true,
      translationId: QURAN_API.DEFAULT_TRANSLATION_ID,
      reciterId: QURAN_API.DEFAULT_RECITER_ID,
      autoScroll: true
    };
  };

  return {
    settings,
    setArabicFontSize,
    setTranslationFontSize,
    toggleLatin,
    toggleTranslation,
    setTranslationId,
    setReciterId,
    toggleAutoScroll,
    resetSettings
  };
});
