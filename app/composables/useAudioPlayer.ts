import { usePlayerStore } from '~/stores/player';
import { useScrollSync } from '~/composables/useScrollSync';
import { useQuranApi } from '~/composables/useQuranApi';
import { QURAN_API } from '~/constants/quran';

let globalAudio: HTMLAudioElement | null = null;

export function useAudioPlayer() {
  const playerStore = usePlayerStore();
  const { scrollToVerse } = useScrollSync();
  const quranApi = useQuranApi();

  const initAudio = (): HTMLAudioElement => {
    if (import.meta.server) {
      return {} as HTMLAudioElement;
    }
    if (!globalAudio) {
      globalAudio = new Audio();
      globalAudio.preload = 'metadata';

      globalAudio.addEventListener('timeupdate', () => {
        if (!globalAudio) return;
        playerStore.updateProgress(globalAudio.currentTime, globalAudio.duration || 0);
      });

      globalAudio.addEventListener('ended', () => {
        if (playerStore.isLooping && globalAudio) {
          globalAudio.currentTime = 0;
          globalAudio.play().catch(() => {
            playerStore.pause();
          });
        } else {
          playerStore.pause();
        }
      });

      globalAudio.addEventListener('error', () => {
        playerStore.pause();
      });
    }

    return globalAudio;
  };

  const playVerse = async (audioUrl: string, verseKey: string, chapterId: number) => {
    if (import.meta.server) return;
    const audio = initAudio();
    if (!audioUrl) return;

    let fullUrl = audioUrl;
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = `${QURAN_API.AUDIO_BASE_URL}${audioUrl.startsWith('/') ? audioUrl.slice(1) : audioUrl}`;
    }

    playerStore.setAudioState({
      chapterId,
      verseKey,
      url: fullUrl,
      timings: []
    });

    audio.src = fullUrl;
    audio.currentTime = 0;

    try {
      await audio.play();
      playerStore.play();
      scrollToVerse(verseKey);
    } catch {
      playerStore.pause();
    }
  };

  const playChapter = async (chapterId: number, reciterId?: number) => {
    if (import.meta.server) return;

    const activeReciterId = reciterId || playerStore.currentReciterId;
    try {
      const response = await quranApi.getChapterRecitation(activeReciterId, chapterId);
      const audioFile = response?.audio_file;
      if (!audioFile || !audioFile.audio_url) return;

      const timings = (audioFile.verse_timings || []).map(vt => ({
        verseKey: vt.verse_key,
        timestampFrom: vt.timestamp_from,
        timestampTo: vt.timestamp_to,
        duration: vt.duration
      }));

      const audio = initAudio();
      playerStore.setAudioState({
        chapterId,
        reciterId: activeReciterId,
        url: audioFile.audio_url,
        timings
      });

      audio.src = audioFile.audio_url;
      audio.currentTime = 0;

      await audio.play();
      playerStore.play();

      const firstTiming = timings[0];
      if (firstTiming?.verseKey) {
        scrollToVerse(firstTiming.verseKey);
      }
    } catch {
      playerStore.pause();
    }
  };

  const togglePlayPause = async () => {
    if (import.meta.server) return;
    const audio = initAudio();

    if (playerStore.isPlaying) {
      audio.pause();
      playerStore.pause();
    } else if (audio.src) {
      try {
        await audio.play();
        playerStore.play();
      } catch {
        playerStore.pause();
      }
    }
  };

  const seekTo = (seconds: number) => {
    if (import.meta.server) return;
    const audio = initAudio();
    const valid = Math.max(0, Math.min(seconds, audio.duration || 0));
    audio.currentTime = valid;
    playerStore.updateProgress(valid, audio.duration || 0);
  };

  const setVolume = (val: number) => {
    if (import.meta.server) return;
    const audio = initAudio();
    const clamped = Math.max(0, Math.min(1, val));
    audio.volume = clamped;
    playerStore.setVolume(clamped);
  };

  const setPlaybackRate = (rate: number) => {
    if (import.meta.server) return;
    const audio = initAudio();
    const clamped = Math.max(0.5, Math.min(2, rate));
    audio.playbackRate = clamped;
    playerStore.setPlaybackRate(clamped);
  };

  watch(() => playerStore.currentVerseKey, (newVerseKey) => {
    if (newVerseKey && playerStore.isPlaying) {
      scrollToVerse(newVerseKey);
    }
  });

  return {
    playVerse,
    playChapter,
    togglePlayPause,
    seekTo,
    setVolume,
    setPlaybackRate
  };
}
