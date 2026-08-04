import { defineStore } from 'pinia';
import { QURAN_API } from '~/constants/quran';

export interface VerseTiming {
  verseKey: string;
  timestampFrom: number;
  timestampTo: number;
  duration: number;
}

export const usePlayerStore = defineStore('player', () => {
  const isPlaying = ref(false);
  const currentChapterId = ref<number | null>(null);
  const currentVerseKey = ref<string | null>(null);
  const currentReciterId = ref<number>(QURAN_API.DEFAULT_RECITER_ID);
  const audioUrl = ref<string | null>(null);
  const currentTime = ref<number>(0);
  const duration = ref<number>(0);
  const volume = ref<number>(1);
  const playbackRate = ref<number>(1);
  const isLooping = ref<boolean>(false);
  const verseTimings = ref<VerseTiming[]>([]);

  const setAudioState = (payload: {
    chapterId?: number;
    verseKey?: string;
    reciterId?: number;
    url?: string;
    timings?: VerseTiming[];
  }) => {
    if (payload.chapterId !== undefined) currentChapterId.value = payload.chapterId;
    if (payload.verseKey !== undefined) currentVerseKey.value = payload.verseKey;
    if (payload.reciterId !== undefined) currentReciterId.value = payload.reciterId;
    if (payload.url !== undefined) audioUrl.value = payload.url;
    if (payload.timings !== undefined) verseTimings.value = payload.timings;
  };

  const updateProgress = (time: number, dur: number) => {
    currentTime.value = time;
    duration.value = dur;

    if (verseTimings.value.length > 0) {
      const ms = time * 1000;
      const matched = verseTimings.value.find(t => ms >= t.timestampFrom && ms <= t.timestampTo);
      if (matched) {
        currentVerseKey.value = matched.verseKey;
      }
    }
  };

  const play = () => {
    isPlaying.value = true;
  };

  const pause = () => {
    isPlaying.value = false;
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

  const resetPlayer = () => {
    isPlaying.value = false;
    currentChapterId.value = null;
    currentVerseKey.value = null;
    audioUrl.value = null;
    currentTime.value = 0;
    duration.value = 0;
    verseTimings.value = [];
  };

  return {
    isPlaying,
    currentChapterId,
    currentVerseKey,
    currentReciterId,
    audioUrl,
    currentTime,
    duration,
    volume,
    playbackRate,
    isLooping,
    verseTimings,
    setAudioState,
    updateProgress,
    play,
    pause,
    setVolume,
    setPlaybackRate,
    toggleLoop,
    resetPlayer
  };
});
