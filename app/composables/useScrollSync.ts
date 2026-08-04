import { useSettingsStore } from '~/stores/settings';

export function useScrollSync() {
  const settingsStore = useSettingsStore();

  const scrollToVerse = (verseKey: string, behavior: ScrollBehavior = 'smooth') => {
    if (!settingsStore.settings.autoScroll || !verseKey) return;
    if (typeof window === 'undefined') return;

    const element = document.getElementById(`verse-${verseKey}`);
    if (element) {
      element.scrollIntoView({
        behavior,
        block: 'center'
      });
    }
  };

  return {
    scrollToVerse
  };
}
