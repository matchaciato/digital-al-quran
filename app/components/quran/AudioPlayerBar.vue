<template>
  <footer v-if="audioStore.audioUrl">
    <section>
      <div>
        <p>Sedang Diputar: Ayat {{ audioStore.currentVerseKey || '-' }}</p>
      </div>

      <nav>
        <button type="button" @click="audioPlayer.togglePlayPause()">
          {{ audioStore.isPlaying ? 'Pause' : 'Play' }}
        </button>
        <button type="button" @click="audioStore.toggleLoop()">
          {{ audioStore.isLooping ? 'Ulangi (Aktif)' : 'Ulangi (Mati)' }}
        </button>
      </nav>

      <div>
        <span>{{ formatTime(audioStore.currentTime) }}</span>
        <input
          type="range"
          min="0"
          :max="audioStore.duration || 100"
          :value="audioStore.currentTime"
          @input="e => audioPlayer.seekTo(Number((e.target as HTMLInputElement).value))"
        />
        <span>{{ formatTime(audioStore.duration) }}</span>
      </div>

      <div>
        <label>Volume:</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          :value="audioStore.volume"
          @input="e => audioPlayer.setVolume(Number((e.target as HTMLInputElement).value))"
        />
      </div>

      <div>
        <label>Kecepatan:</label>
        <select :value="audioStore.playbackRate" @change="e => audioPlayer.setPlaybackRate(Number((e.target as HTMLSelectElement).value))">
          <option :value="0.75">0.75x</option>
          <option :value="1.0">1.0x (Normal)</option>
          <option :value="1.25">1.25x</option>
          <option :value="1.5">1.5x</option>
          <option :value="2.0">2.0x</option>
        </select>
      </div>

      <button type="button" @click="audioStore.reset()">Tutup Audio</button>
    </section>
  </footer>
</template>

<script setup lang="ts">
import { useAudioStore } from '~/stores/useAudioStore';
import { useAudioPlayer } from '~/composables/useAudioPlayer';

const audioStore = useAudioStore();
const audioPlayer = useAudioPlayer();

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
</script>
