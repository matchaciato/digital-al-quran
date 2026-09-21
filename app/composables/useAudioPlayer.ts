import { useAudioStore } from '~/stores/useAudioStore';
import { useSettingsStore } from '~/stores/useSettingsStore';
import { useHifzLoop } from '~/composables/useHifzLoop';
import { resolveVerseAudioUrl } from '~/utils/audioUrlResolver';

let audioElement: HTMLAudioElement | null = null;

export function useAudioPlayer() {
  const audioStore = useAudioStore();
  const settings = useSettingsStore();
  const hifz = useHifzLoop();

  const getAudioElement = (): HTMLAudioElement => {
    if (!audioElement && import.meta.client) {
      audioElement = new Audio();
      audioElement.preload = 'auto';
      audioElement.loop = audioStore.isLooping;
      setupAudioListeners(audioElement);
    }
    return audioElement!;
  };

  const setupAudioListeners = (audio: HTMLAudioElement) => {
    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && !isNaN(audio.duration)) {
        audioStore.updateTime(audio.currentTime, audio.duration);
      }
    });

    audio.addEventListener('durationchange', () => {
      if (audio.duration && !isNaN(audio.duration)) {
        audioStore.updateTime(audio.currentTime, audio.duration);
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (!audio) return;
      const dur = (audio.duration && !isNaN(audio.duration)) ? audio.duration : audioStore.duration;
      audioStore.updateTime(audio.currentTime, dur);
      syncActiveVerse(audio.currentTime);
    });

    audio.addEventListener('play', () => {
      audioStore.setPlaybackStatus(true);
    });

    audio.addEventListener('pause', () => {
      audioStore.setPlaybackStatus(false);
    });

    audio.addEventListener('ended', () => {
      // 1. Check if Hifz Loop is active
      if (audioStore.isHifzActive) {
        const handled = hifz.handleVerseEnded((url, verseKey) => {
          playVerse(url, verseKey);
        });
        if (handled) return;
      }

      // 2. Check if Single Verse Looping is active
      if (audioStore.isLooping && audioStore.currentVerseKey) {
        audio.currentTime = 0;
        audio.play().catch(e => console.warn(e));
        audioStore.setPlaybackStatus(true);
        return;
      }

      // 3. Check if Continuous Auto-Advance is enabled
      if (audioStore.isAutoAdvance) {
        const playedNext = playNextVerse();
        if (playedNext) return;
      }

      // Default: Audio finished
      if (audio.duration) {
        audioStore.updateTime(audio.duration, audio.duration);
      }
      audioStore.setPlaybackStatus(false);
    });

    audio.addEventListener('error', (e) => {
      console.warn('Audio playback error on current element source:', e);
      audioStore.setPlaybackStatus(false);
    });
  };

  const syncActiveVerse = (currentTimeMs: number) => {
    const timeInMs = currentTimeMs * 1000;
    const timings = audioStore.audioFile?.verse_timings;

    if (timings && timings.length > 0) {
      const activeTiming = timings.find(
        (t) => timeInMs >= t.timestamp_from && timeInMs <= t.timestamp_to
      );
      if (activeTiming && activeTiming.verse_key !== audioStore.currentVerseKey) {
        audioStore.setActiveVerseKey(activeTiming.verse_key);
        scrollToVerse(activeTiming.verse_key);
      }
    }
  };

  const scrollToVerse = (verseKey: string) => {
    if (!import.meta.client) return;
    const element =
      document.getElementById(`verse-${verseKey}`) ||
      document.getElementById(`mushaf-verse-${verseKey}`) ||
      document.getElementById(`zen-verse-${verseKey}`) ||
      document.getElementById(`parallel-verse-${verseKey}`);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const playVerse = async (audioUrl: string | undefined | null, verseKey: string) => {
    const audio = getAudioElement();
    const formattedUrl = resolveVerseAudioUrl(audioUrl, verseKey, settings.selectedReciterId);

    if (!formattedUrl) {
      console.warn('Cannot resolve audio URL for verse', verseKey);
      return;
    }

    audio.loop = audioStore.isLooping;

    if (audioStore.audioUrl !== formattedUrl || audio.src !== formattedUrl) {
      audio.src = formattedUrl;
      audio.load();
      audioStore.setAudioSource(formattedUrl, Number(verseKey.split(':')[0]));
    }

    audioStore.setActiveVerseKey(verseKey);
    scrollToVerse(verseKey);

    try {
      await audio.play();
      audioStore.setPlaybackStatus(true);
    } catch (err) {
      console.warn('Playback retry with standard format...', err);
      if (verseKey.includes(':')) {
        const [s, a] = verseKey.split(':');
        const fallbackUrl = `https://verses.quran.com/Alafasy/mp3/${String(s).padStart(3, '0')}${String(a).padStart(3, '0')}.mp3`;
        if (audio.src !== fallbackUrl) {
          audio.src = fallbackUrl;
          audio.load();
          try {
            await audio.play();
            audioStore.setPlaybackStatus(true);
          } catch (e) {
            audioStore.setPlaybackStatus(false);
          }
        }
      }
    }
  };

  const playNextVerse = (): boolean => {
    if (!audioStore.currentVerseKey || audioStore.versesList.length === 0) return false;
    const currentIndex = audioStore.versesList.findIndex(
      (v) => v.verse_key === audioStore.currentVerseKey
    );
    if (currentIndex !== -1 && currentIndex + 1 < audioStore.versesList.length) {
      const next = audioStore.versesList[currentIndex + 1];
      if (next) {
        playVerse(next.audio?.url, next.verse_key);
        return true;
      }
    }
    return false;
  };

  const playPreviousVerse = (): boolean => {
    if (!audioStore.currentVerseKey || audioStore.versesList.length === 0) return false;
    const currentIndex = audioStore.versesList.findIndex(
      (v) => v.verse_key === audioStore.currentVerseKey
    );
    if (currentIndex > 0) {
      const prev = audioStore.versesList[currentIndex - 1];
      if (prev) {
        playVerse(prev.audio?.url, prev.verse_key);
        return true;
      }
    }
    return false;
  };

  const togglePlayPause = async () => {
    const audio = getAudioElement();
    if (!audio.src) return;

    if (audioStore.isPlaying) {
      audio.pause();
    } else {
      try {
        await audio.play();
        audioStore.setPlaybackStatus(true);
      } catch (err) {
        audioStore.setPlaybackStatus(false);
      }
    }
  };

  const toggleLoop = () => {
    audioStore.toggleLoop();
    const audio = getAudioElement();
    if (audio) {
      audio.loop = audioStore.isLooping;
    }
  };

  const toggleAutoAdvance = () => {
    audioStore.toggleAutoAdvance();
  };

  const stopAudio = () => {
    const audio = getAudioElement();
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute('src');
      audio.load();
    }
    audioStore.reset();
  };

  const closePlayer = () => {
    stopAudio();
  };

  const seekTo = (seconds: number) => {
    const audio = getAudioElement();
    if (audio && !isNaN(seconds)) {
      audio.currentTime = seconds;
      audioStore.updateTime(seconds, audio.duration || audioStore.duration);
    }
  };

  const setVolume = (val: number) => {
    const audio = getAudioElement();
    audioStore.setVolume(val);
    if (audio) {
      audio.volume = audioStore.volume;
    }
  };

  const setPlaybackRate = (rate: number) => {
    const audio = getAudioElement();
    audioStore.setPlaybackRate(rate);
    if (audio) {
      audio.playbackRate = audioStore.playbackRate;
    }
  };

  if (import.meta.client) {
    watch(() => settings.selectedReciterId, (newReciterId) => {
      if (audioStore.currentVerseKey) {
        const newUrl = resolveVerseAudioUrl(null, audioStore.currentVerseKey, newReciterId);
        const wasPlaying = audioStore.isPlaying;
        const audio = getAudioElement();
        audio.src = newUrl;
        audio.load();
        audioStore.setAudioSource(newUrl, audioStore.currentChapterId || 1);
        if (wasPlaying) {
          audio.play().catch(e => console.warn(e));
        }
      }
    });
  }

  return {
    playVerse,
    playNextVerse,
    playPreviousVerse,
    togglePlayPause,
    toggleLoop,
    toggleAutoAdvance,
    stopAudio,
    closePlayer,
    seekTo,
    setVolume,
    setPlaybackRate,
    scrollToVerse
  };
}
