import { defineStore } from 'pinia';
import type { AudioFile, Verse } from '~/types/quran';

export const useAudioStore = defineStore('audio', () => {
  const isPlaying = ref(false);
  const currentChapterId = ref<number | null>(null);
  const currentVerseKey = ref<string | null>(null);
  const audioUrl = ref<string | null>(null);
  const currentTime = ref(0);
  const duration = ref(0);
  const volume = ref(1);
  const playbackRate = ref(1);
  const isLooping = ref(false);
  const audioFile = ref<AudioFile | null>(null);
  const versesList = ref<Verse[]>([]);
  const isAutoAdvance = ref(true);

  // Hifz Loop State
  const isHifzActive = ref(false);
  const hifzStartVerseKey = ref('1:1');
  const hifzEndVerseKey = ref('1:7');
  const hifzRepeatCount = ref(3);
  const hifzCurrentRepeat = ref(1);
  const hifzPauseGapSeconds = ref(2);
  const isHifzWaitingGap = ref(false);
  const hifzGapCountdown = ref(0);

  const setAudioSource = (url: string, chapterId: number, verses: Verse[] = [], fileInfo: AudioFile | null = null) => {
    audioUrl.value = url;
    currentChapterId.value = chapterId;
    if (verses.length > 0) {
      versesList.value = verses;
    }
    audioFile.value = fileInfo;
  };

  const setVersesList = (verses: Verse[]) => {
    versesList.value = verses;
  };

  const setActiveVerseKey = (key: string | null) => {
    currentVerseKey.value = key;
  };

  const setPlaybackStatus = (playing: boolean) => {
    isPlaying.value = playing;
  };

  const updateTime = (time: number, totalDuration: number) => {
    currentTime.value = time;
    if (totalDuration > 0) {
      duration.value = totalDuration;
    }
  };

  const setVolume = (val: number) => {
    volume.value = Math.min(1, Math.max(0, val));
  };

  const setPlaybackRate = (rate: number) => {
    playbackRate.value = Math.min(2, Math.max(0.5, rate));
  };

  const toggleLoop = () => {
    isLooping.value = !isLooping.value;
  };

  const toggleAutoAdvance = () => {
    isAutoAdvance.value = !isAutoAdvance.value;
  };

  const setAutoAdvance = (val: boolean) => {
    isAutoAdvance.value = val;
  };

  const startHifz = (startKey: string, endKey: string, repeat: number, gap: number) => {
    isHifzActive.value = true;
    hifzStartVerseKey.value = startKey;
    hifzEndVerseKey.value = endKey;
    hifzRepeatCount.value = Math.max(1, repeat);
    hifzCurrentRepeat.value = 1;
    hifzPauseGapSeconds.value = Math.max(0, gap);
    isHifzWaitingGap.value = false;
    hifzGapCountdown.value = 0;
  };

  const stopHifz = () => {
    isHifzActive.value = false;
    isHifzWaitingGap.value = false;
    hifzGapCountdown.value = 0;
  };

  const setHifzProgress = (current: number) => {
    hifzCurrentRepeat.value = current;
  };

  const setHifzWaitingGap = (waiting: boolean, countdown = 0) => {
    isHifzWaitingGap.value = waiting;
    hifzGapCountdown.value = countdown;
  };

  const reset = () => {
    isPlaying.value = false;
    currentChapterId.value = null;
    currentVerseKey.value = null;
    audioUrl.value = null;
    currentTime.value = 0;
    duration.value = 0;
    audioFile.value = null;
    versesList.value = [];
    isHifzActive.value = false;
    isHifzWaitingGap.value = false;
  };

  return {
    isPlaying,
    currentChapterId,
    currentVerseKey,
    audioUrl,
    currentTime,
    duration,
    volume,
    playbackRate,
    isLooping,
    audioFile,
    versesList,
    isAutoAdvance,
    isHifzActive,
    hifzStartVerseKey,
    hifzEndVerseKey,
    hifzRepeatCount,
    hifzCurrentRepeat,
    hifzPauseGapSeconds,
    isHifzWaitingGap,
    hifzGapCountdown,
    setAudioSource,
    setVersesList,
    setActiveVerseKey,
    setPlaybackStatus,
    updateTime,
    setVolume,
    setPlaybackRate,
    toggleLoop,
    toggleAutoAdvance,
    setAutoAdvance,
    startHifz,
    stopHifz,
    setHifzProgress,
    setHifzWaitingGap,
    reset
  };
});
