import { useAudioStore } from '~/stores/useAudioStore';
import type { Verse } from '~/types/quran';

let gapTimer: ReturnType<typeof setTimeout> | null = null;
let countdownInterval: ReturnType<typeof setInterval> | null = null;

export const useHifzLoop = () => {
  const audioStore = useAudioStore();

  const isHifzActive = computed(() => audioStore.isHifzActive);
  const startVerseKey = computed({
    get: () => audioStore.hifzStartVerseKey,
    set: (val: string) => { audioStore.hifzStartVerseKey = val; }
  });
  const endVerseKey = computed({
    get: () => audioStore.hifzEndVerseKey,
    set: (val: string) => { audioStore.hifzEndVerseKey = val; }
  });
  const repeatCount = computed({
    get: () => audioStore.hifzRepeatCount,
    set: (val: number) => { audioStore.hifzRepeatCount = val; }
  });
  const currentRepeat = computed(() => audioStore.hifzCurrentRepeat);
  const pauseGapSeconds = computed({
    get: () => audioStore.hifzPauseGapSeconds,
    set: (val: number) => { audioStore.hifzPauseGapSeconds = val; }
  });
  const isWaitingGap = computed(() => audioStore.isHifzWaitingGap);
  const gapCountdown = computed(() => audioStore.hifzGapCountdown);

  const clearTimers = () => {
    if (gapTimer) {
      clearTimeout(gapTimer);
      gapTimer = null;
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    audioStore.setHifzWaitingGap(false, 0);
  };

  const getVersesInRange = (verses: Verse[]): Verse[] => {
    const list = (verses && verses.length > 0) ? verses : audioStore.versesList;
    if (!list || list.length === 0) return [];
    const startIndex = list.findIndex(v => v.verse_key === audioStore.hifzStartVerseKey);
    const endIndex = list.findIndex(v => v.verse_key === audioStore.hifzEndVerseKey);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      return list.slice(0, Math.min(5, list.length));
    }
    return list.slice(startIndex, endIndex + 1);
  };

  const startLoop = (
    verses: Verse[],
    playVerseFn?: (audioUrl: string, verseKey: string) => void
  ) => {
    clearTimers();
    const range = getVersesInRange(verses);
    if (range.length === 0) return;

    audioStore.startHifz(
      audioStore.hifzStartVerseKey,
      audioStore.hifzEndVerseKey,
      audioStore.hifzRepeatCount,
      audioStore.hifzPauseGapSeconds
    );

    const firstVerse = range[0];
    if (firstVerse && playVerseFn) {
      playVerseFn(firstVerse.audio?.url || '', firstVerse.verse_key);
    }
  };

  const stopLoop = () => {
    clearTimers();
    audioStore.stopHifz();
  };

  const triggerGapAndPlay = (
    audioUrl: string,
    verseKey: string,
    playVerseFn: (audioUrl: string, verseKey: string) => void
  ) => {
    clearTimers();
    const gap = audioStore.hifzPauseGapSeconds;
    if (gap > 0) {
      audioStore.setHifzWaitingGap(true, gap);

      countdownInterval = setInterval(() => {
        const next = audioStore.hifzGapCountdown - 1;
        if (next >= 0) {
          audioStore.setHifzWaitingGap(true, next);
        }
      }, 1000);

      gapTimer = setTimeout(() => {
        clearTimers();
        if (audioStore.isHifzActive) {
          playVerseFn(audioUrl, verseKey);
        }
      }, gap * 1000);
    } else {
      playVerseFn(audioUrl, verseKey);
    }
  };

  const handleVerseEnded = (
    playVerseFn: (audioUrl: string, verseKey: string) => void
  ): boolean => {
    if (!audioStore.isHifzActive) return false;

    const range = getVersesInRange(audioStore.versesList);
    const currentIndex = range.findIndex(v => v.verse_key === audioStore.currentVerseKey);
    if (currentIndex === -1) {
      stopLoop();
      return false;
    }

    const currentVerse = range[currentIndex];

    if (audioStore.hifzCurrentRepeat < audioStore.hifzRepeatCount) {
      audioStore.setHifzProgress(audioStore.hifzCurrentRepeat + 1);
      triggerGapAndPlay(currentVerse?.audio?.url || '', currentVerse!.verse_key, playVerseFn);
      return true;
    } else {
      audioStore.setHifzProgress(1);
      const nextIndex = currentIndex + 1;

      if (nextIndex < range.length) {
        const nextVerse = range[nextIndex];
        triggerGapAndPlay(nextVerse?.audio?.url || '', nextVerse!.verse_key, playVerseFn);
        return true;
      } else {
        stopLoop();
        return true;
      }
    }
  };

  return {
    isHifzActive,
    startVerseKey,
    endVerseKey,
    repeatCount,
    currentRepeat,
    pauseGapSeconds,
    isWaitingGap,
    gapCountdown,
    getVersesInRange,
    startLoop,
    stopLoop,
    handleVerseEnded
  };
};
