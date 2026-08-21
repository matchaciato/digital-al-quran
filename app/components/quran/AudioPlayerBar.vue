<template>
  <div
    v-if="audioStore.audioUrl"
    class="fixed bottom-4 left-1/2 z-40 w-[95%] max-w-5xl -translate-x-1/2 rounded-2xl border border-border/80 bg-background/90 p-4 shadow-xl backdrop-blur-md transition-all duration-300"
  >
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <span class="flex h-8 shrink-0 items-center justify-center rounded-lg bg-primary px-2.5 text-xs font-bold text-primary-foreground">
            {{ audioStore.currentVerseKey ? `Ayat ${audioStore.currentVerseKey}` : 'Murottal' }}
          </span>
          <div class="min-w-0">
            <p class="truncate text-xs font-semibold text-foreground">
              {{ currentReciterName }}
            </p>
            <p class="truncate text-[11px] text-muted-foreground">
              Surah ke-{{ audioStore.currentChapterId || 1 }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="isHifzModalOpen = true"
            class="rounded-md border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
            :class="[
              hifz.isHifzActive.value
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground'
            ]"
            title="Buka Studio Hafalan (Hifz A-B Loop)"
          >
            {{ hifz.isHifzActive.value ? `Hifz (Loop ${hifz.currentRepeat.value}/${hifz.repeatCount.value})` : 'Studio Hifz' }}
          </button>

          <button
            type="button"
            @click="audioPlayer.togglePlayPause()"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition-all"
            :title="audioStore.isPlaying ? 'Jeda Audio' : 'Putar Audio'"
          >
            <Pause v-if="audioStore.isPlaying" class="h-4 w-4" />
            <Play v-else class="h-4 w-4 fill-current ml-0.5" />
          </button>

          <button
            type="button"
            @click="audioPlayer.toggleLoop()"
            class="rounded-md p-1.5 transition-colors"
            :class="[
              audioStore.isLooping
                ? 'text-primary bg-primary/10 font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
            :title="audioStore.isLooping ? 'Pengulangan Aktif (Looping On)' : 'Pengulangan Mati'"
          >
            <Repeat class="h-4 w-4" />
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="isReciterModalOpen = true"
            class="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground inline-block"
            title="Ganti Qari"
          >
            Ganti Qari
          </button>

          <select
            :value="audioStore.playbackRate"
            @change="e => audioPlayer.setPlaybackRate(Number((e.target as HTMLSelectElement).value))"
            class="rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground focus:outline-none"
            title="Kecepatan Putar"
          >
            <option :value="0.75">0.75x</option>
            <option :value="1.0">1.0x</option>
            <option :value="1.25">1.25x</option>
            <option :value="1.5">1.5x</option>
          </select>

          <button
            type="button"
            @click="audioPlayer.closePlayer()"
            class="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Tutup Pemutar Audio"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>

      <div class="flex items-center gap-3 text-xs text-muted-foreground font-mono">
        <span>{{ formatTime(audioStore.currentTime) }}</span>
        <input
          type="range"
          min="0"
          :max="audioStore.duration > 0 ? audioStore.duration : 1"
          step="0.1"
          :value="Math.min(audioStore.currentTime, audioStore.duration || 1)"
          @input="e => audioPlayer.seekTo(Number((e.target as HTMLInputElement).value))"
          class="h-1.5 w-full cursor-pointer rounded-lg bg-muted accent-primary"
        />
        <span>{{ formatTime(audioStore.duration) }}</span>
      </div>
    </div>

    <QuranAudioHifzLoopModal
      :is-open="isHifzModalOpen"
      :initial-start-key="audioStore.currentVerseKey || '1:1'"
      :initial-end-key="audioStore.currentVerseKey || '1:7'"
      @close="isHifzModalOpen = false"
      @start="handleStartHifz"
    />

    <QuranAudioReciterSelector
      :is-open="isReciterModalOpen"
      @close="isReciterModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { Play, Pause, Repeat, X } from '@lucide/vue';
import { useAudioStore } from '~/stores/useAudioStore';
import { useSettingsStore } from '~/stores/useSettingsStore';
import { useAudioPlayer } from '~/composables/useAudioPlayer';
import { useHifzLoop } from '~/composables/useHifzLoop';
import { RECITERS_CATALOG } from '~/constants/reciters';

const audioStore = useAudioStore();
const settings = useSettingsStore();
const audioPlayer = useAudioPlayer();
const hifz = useHifzLoop();

const isHifzModalOpen = ref(false);
const isReciterModalOpen = ref(false);

const currentReciterName = computed(() => {
  const found = RECITERS_CATALOG.find(r => r.id === settings.selectedReciterId);
  return found?.name || 'Mishary Rashid Alafasy';
});

const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const handleStartHifz = (config: { startKey: string; endKey: string; repeatCount: number; pauseGap: number }) => {
  hifz.startVerseKey.value = config.startKey;
  hifz.endVerseKey.value = config.endKey;
  hifz.repeatCount.value = config.repeatCount;
  hifz.pauseGapSeconds.value = config.pauseGap;
  hifz.startLoop(audioStore.versesList);
};
</script>
