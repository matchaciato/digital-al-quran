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

  const setAudioSource = (url: string, chapterId: number, verses: Verse[] = [], fileInfo: AudioFile | null = null) => {
    audioUrl.value = url;
    currentChapterId.value = chapterId;
    versesList.value = verses;
    audioFile.value = fileInfo;
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

  const reset = () => {
    isPlaying.value = false;
    currentChapterId.value = null;
    currentVerseKey.value = null;
    audioUrl.value = null;
    currentTime.value = 0;
    duration.value = 0;
    audioFile.value = null;
    versesList.value = [];
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
    setAudioSource,
    setActiveVerseKey,
    setPlaybackStatus,
    updateTime,
    setVolume,
    setPlaybackRate,
    toggleLoop,
    reset
  };
});
