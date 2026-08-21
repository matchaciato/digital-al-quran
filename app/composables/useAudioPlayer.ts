import { useAudioStore } from '~/stores/useAudioStore';
import { useSettingsStore } from '~/stores/useSettingsStore';
import { resolveVerseAudioUrl } from '~/utils/audioUrlResolver';

let audioElement: HTMLAudioElement | null = null;

export function useAudioPlayer() {
  const audioStore = useAudioStore();
  const settings = useSettingsStore();

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
      if (audioStore.isLooping && audioStore.currentVerseKey) {
        audio.currentTime = 0;
        audio.play().catch(e => console.warn(e));
        audioStore.setPlaybackStatus(true);
      } else {
        if (audio.duration) {
          audioStore.updateTime(audio.duration, audio.duration);
        }
        audioStore.setPlaybackStatus(false);
      }
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
    const element = document.getElementById(`verse-${verseKey}`);
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
    try {
      await audio.play();
      audioStore.setPlaybackStatus(true);
    } catch (err) {
      console.warn('Playback retry with standard format...', err);
      // Fallback
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
    togglePlayPause,
    toggleLoop,
    seekTo,
    setVolume,
    setPlaybackRate,
    scrollToVerse
  };
}
