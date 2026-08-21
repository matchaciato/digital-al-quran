import { useAudioStore } from '~/stores/useAudioStore';
import { useAudioPlayer } from '~/composables/useAudioPlayer';
import type { Verse } from '~/types/quran';

export const useHifzLoop = () => {
  const audioStore = useAudioStore();
  const audioPlayer = useAudioPlayer();

  const isHifzActive = ref(false);
  const isHifzModalOpen = ref(false);
  const startVerseKey = ref('1:1');
  const endVerseKey = ref('1:7');
  const repeatCount = ref(3);
  const currentRepeat = ref(1);
  const pauseGapSeconds = ref(2);
  const isWaitingGap = ref(false);
  const gapCountdown = ref(0);

  let gapTimer: ReturnType<typeof setTimeout> | null = null;
  let countdownInterval: ReturnType<typeof setInterval> | null = null;

  const getVersesInRange = (verses: Verse[]): Verse[] => {
    if (!verses || verses.length === 0) return [];
    const startIndex = verses.findIndex(v => v.verse_key === startVerseKey.value);
    const endIndex = verses.findIndex(v => v.verse_key === endVerseKey.value);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      return verses.slice(0, Math.min(5, verses.length));
    }
    return verses.slice(startIndex, endIndex + 1);
  };

  const startLoop = (verses: Verse[]) => {
    const range = getVersesInRange(verses);
    if (range.length === 0) return;

    isHifzActive.value = true;
    currentRepeat.value = 1;
    isWaitingGap.value = false;

    const firstVerse = range[0];
    if (firstVerse && firstVerse.audio?.url) {
      audioPlayer.playVerse(firstVerse.audio.url, firstVerse.verse_key);
    }
  };

  const stopLoop = () => {
    isHifzActive.value = false;
    isWaitingGap.value = false;
    if (gapTimer) clearTimeout(gapTimer);
    if (countdownInterval) clearInterval(countdownInterval);
  };

  const handleVerseEnded = (verses: Verse[]) => {
    if (!isHifzActive.value) return;

    const range = getVersesInRange(verses);
    const currentIndex = range.findIndex(v => v.verse_key === audioStore.currentVerseKey);
    if (currentIndex === -1) {
      stopLoop();
      return;
    }

    const currentVerse = range[currentIndex];

    if (currentRepeat.value < repeatCount.value) {
      currentRepeat.value++;
      triggerGapAndPlay(currentVerse!.audio?.url || '', currentVerse!.verse_key);
    } else {
      currentRepeat.value = 1;
      const nextIndex = currentIndex + 1;

      if (nextIndex < range.length) {
        const nextVerse = range[nextIndex];
        triggerGapAndPlay(nextVerse!.audio?.url || '', nextVerse!.verse_key);
      } else {
        stopLoop();
      }
    }
  };

  const triggerGapAndPlay = (audioUrl: string, verseKey: string) => {
    if (pauseGapSeconds.value > 0) {
      isWaitingGap.value = true;
      gapCountdown.value = pauseGapSeconds.value;

      countdownInterval = setInterval(() => {
        gapCountdown.value--;
      }, 1000);

      gapTimer = setTimeout(() => {
        if (countdownInterval) clearInterval(countdownInterval);
        isWaitingGap.value = false;
        if (isHifzActive.value) {
          audioPlayer.playVerse(audioUrl, verseKey);
        }
      }, pauseGapSeconds.value * 1000);
    } else {
      audioPlayer.playVerse(audioUrl, verseKey);
    }
  };

  return {
    isHifzActive,
    isHifzModalOpen,
    startVerseKey,
    endVerseKey,
    repeatCount,
    currentRepeat,
    pauseGapSeconds,
    isWaitingGap,
    gapCountdown,
    startLoop,
    stopLoop,
    handleVerseEnded
  };
};
