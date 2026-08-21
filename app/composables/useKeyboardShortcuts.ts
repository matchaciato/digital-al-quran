import { useAudioPlayer } from '~/composables/useAudioPlayer';
import { useAudioStore } from '~/stores/useAudioStore';
import { useSettingsStore } from '~/stores/useSettingsStore';

export const useKeyboardShortcuts = () => {
  const isCommandPaletteOpen = ref(false);
  const isHelpModalOpen = ref(false);

  const audioPlayer = useAudioPlayer();
  const audioStore = useAudioStore();
  const settings = useSettingsStore();

  if (import.meta.client) {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        isCommandPaletteOpen.value = !isCommandPaletteOpen.value;
        return;
      }

      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInput = activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable;

      if (isInput) return;

      if (e.key === '/') {
        e.preventDefault();
        isCommandPaletteOpen.value = true;
      }

      if (e.key === '?') {
        e.preventDefault();
        isHelpModalOpen.value = !isHelpModalOpen.value;
      }

      if (e.code === 'Space' && audioStore.audioUrl) {
        e.preventDefault();
        audioPlayer.togglePlayPause();
      }

      if (e.key.toLowerCase() === 'f') {
        if (settings.readingMode === 'zen') {
          settings.setReadingMode('verse');
        } else {
          settings.setReadingMode('zen');
        }
      }

      if (e.key === 'Escape') {
        isCommandPaletteOpen.value = false;
        isHelpModalOpen.value = false;
        if (settings.readingMode === 'zen') {
          settings.setReadingMode('verse');
        }
      }
    });
  }

  const openCommandPalette = () => {
    isCommandPaletteOpen.value = true;
  };

  const closeCommandPalette = () => {
    isCommandPaletteOpen.value = false;
  };

  return {
    isCommandPaletteOpen,
    isHelpModalOpen,
    openCommandPalette,
    closeCommandPalette
  };
};
