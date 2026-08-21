import { useAudioStore } from '~/stores/useAudioStore';
import { resolveVerseAudioUrl } from '~/utils/audioUrlResolver';

let audioElement: HTMLAudioElement | null = null;

export function useAudioPlayer() {
  const audioStore = useAudioStore();

  const getAudioElement = (): HTMLAudioElement => {
    if (!audioElement && import.meta.client) {
      audioElement = new Audio();
      setupAudioListeners(audioElement);
    }
    return audioElement!;
  };

  const setupAudioListeners = (audio: HTMLAudioElement) => {
    audio.addEventListener('timeupdate', () => {
      if (!audio) return;
      audioStore.updateTime(audio.currentTime, audio.duration || 0);
      syncActiveVerse(audio.currentTime);
    });

    audio.addEventListener('play', () => {
      audioStore.setPlaybackStatus(true);
    });

    audio.addEventListener('pause', () => {
      audioStore.setPlaybackStatus(false);
    });

    audio.addEventListener('ended', () => {
      audioStore.setPlaybackStatus(false);
      handleAudioEnded();
    });

    audio.addEventListener('error', (e) => {
      console.warn('Audio playback error encountered on current source:', e);
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
    const formattedUrl = resolveVerseAudioUrl(audioUrl, verseKey);

    if (!formattedUrl) {
      console.warn('Cannot resolve audio URL for verse', verseKey);
      return;
    }

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
      console.warn('Autoplay prevented or audio source failed, attempting fallback...', err);
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

  const seekTo = (seconds: number) => {
    const audio = getAudioElement();
    if (audio && !isNaN(seconds)) {
      audio.currentTime = seconds;
      audioStore.updateTime(seconds, audio.duration || 0);
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

  const handleAudioEnded = () => {
    if (audioStore.isLooping && audioStore.currentVerseKey) {
      const audio = getAudioElement();
      audio.currentTime = 0;
      audio.play().catch(e => console.warn(e));
    } else {
      audioStore.setActiveVerseKey(null);
    }
  };

  return {
    playVerse,
    togglePlayPause,
    seekTo,
    setVolume,
    setPlaybackRate,
    scrollToVerse
  };
}
