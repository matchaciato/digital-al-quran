<template>
  <aside
    v-if="audioStore.audioUrl"
    aria-label="Pemutar Audio Murottal"
    class="fixed bottom-16 sm:bottom-4 left-1/2 z-40 w-[94%] max-w-4xl -translate-x-1/2 rounded-2xl border border-border/80 bg-background/95 p-3.5 sm:p-4 shadow-2xl backdrop-blur-lg transition-all duration-300"
  >
    <div class="flex flex-col gap-2.5 sm:gap-3">
      <!-- Top Row: Info & Controls -->
      <div class="flex items-center justify-between gap-2">
        <!-- Verse & Reciter Info -->
        <div class="flex items-center gap-2.5 min-w-0 flex-1">
          <span class="flex h-7 sm:h-8 shrink-0 items-center justify-center rounded-lg bg-primary px-2 sm:px-2.5 text-[11px] sm:text-xs font-bold text-primary-foreground">
            {{ audioStore.currentVerseKey ? `Ayat ${audioStore.currentVerseKey}` : 'Murottal' }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-semibold text-foreground">
              {{ currentReciterName }}
            </p>
            <div class="flex items-center gap-1.5 truncate text-[10px] sm:text-[11px] text-muted-foreground">
              <span>Surah ke-{{ audioStore.currentChapterId || 1 }}</span>
              <span v-if="audioStore.isHifzWaitingGap" class="inline-flex items-center rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 animate-pulse">
                Jeda: {{ audioStore.hifzGapCountdown }}s
              </span>
            </div>
          </div>
        </div>

        <!-- Center Controls (Desktop / Tablet) -->
        <div class="hidden sm:flex items-center gap-2">
          <!-- Hifz Studio Toggle -->
          <button
            type="button"
            @click="isHifzModalOpen = true"
            class="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
            :class="[
              audioStore.isHifzActive
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground'
            ]"
            title="Buka Studio Hafalan (Hifz A-B Loop)"
          >
            {{ audioStore.isHifzActive ? `Hifz (${audioStore.hifzCurrentRepeat}/${audioStore.hifzRepeatCount})` : 'Studio Hifz' }}
          </button>

          <!-- Prev Verse -->
          <button
            type="button"
            @click="audioPlayer.playPreviousVerse()"
            class="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all"
            title="Ayat Sebelumnya"
          >
            <SkipBack class="h-4 w-4" />
          </button>

          <!-- Play/Pause -->
          <button
            type="button"
            @click="audioPlayer.togglePlayPause()"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:scale-95 transition-all"
            :title="audioStore.isPlaying ? 'Jeda Audio' : 'Putar Audio'"
          >
            <Pause v-if="audioStore.isPlaying" class="h-4 w-4" />
            <Play v-else class="h-4 w-4 fill-current ml-0.5" />
          </button>

          <!-- Next Verse -->
          <button
            type="button"
            @click="audioPlayer.playNextVerse()"
            class="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all"
            title="Ayat Berikutnya"
          >
            <SkipForward class="h-4 w-4" />
          </button>

          <!-- Loop Single Verse -->
          <button
            type="button"
            @click="audioPlayer.toggleLoop()"
            class="rounded-lg p-2 transition-colors"
            :class="[
              audioStore.isLooping
                ? 'text-primary bg-primary/10 font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
            :title="audioStore.isLooping ? 'Pengulangan Ayat Aktif' : 'Pengulangan Ayat Mati'"
          >
            <Repeat class="h-4 w-4" />
          </button>

          <!-- Auto-Advance Continuous Playback -->
          <button
            type="button"
            @click="audioPlayer.toggleAutoAdvance()"
            class="rounded-lg p-2 text-xs transition-colors flex items-center gap-1"
            :class="[
              audioStore.isAutoAdvance
                ? 'text-primary bg-primary/10 font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
            :title="audioStore.isAutoAdvance ? 'Auto-Advance Aktif (Putar Berurutan)' : 'Auto-Advance Mati'"
          >
            <FastForward class="h-4 w-4" />
          </button>
        </div>

        <!-- Right Controls: Reciter, Speed, Close -->
        <div class="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            @click="isReciterModalOpen = true"
            class="hidden md:inline-block rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Ganti Qari"
          >
            Ganti Qari
          </button>

          <select
            :value="audioStore.playbackRate"
            @change="e => audioPlayer.setPlaybackRate(Number((e.target as HTMLSelectElement).value))"
            class="rounded-lg border border-border bg-card px-2 py-1 text-xs text-foreground focus:outline-none cursor-pointer"
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
            class="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95"
            title="Tutup Pemutar Audio"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Mobile Controls Row -->
      <div class="flex sm:hidden items-center justify-between border-t border-border/40 pt-2 text-xs">
        <button
          type="button"
          @click="isReciterModalOpen = true"
          class="rounded-md border border-border/80 px-2 py-1 text-[11px] font-medium text-muted-foreground active:bg-muted"
        >
          Qari
        </button>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="audioPlayer.playPreviousVerse()"
            class="rounded-md p-1.5 text-muted-foreground active:scale-95"
            title="Ayat Sebelumnya"
          >
            <SkipBack class="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            @click="audioPlayer.toggleLoop()"
            class="rounded-md p-1.5 transition-colors"
            :class="[
              audioStore.isLooping
                ? 'text-primary bg-primary/10 font-semibold'
                : 'text-muted-foreground'
            ]"
            title="Pengulangan"
          >
            <Repeat class="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            @click="audioPlayer.togglePlayPause()"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm active:scale-90 transition-all"
            :title="audioStore.isPlaying ? 'Jeda' : 'Putar'"
          >
            <Pause v-if="audioStore.isPlaying" class="h-3.5 w-3.5" />
            <Play v-else class="h-3.5 w-3.5 fill-current ml-0.5" />
          </button>

          <button
            type="button"
            @click="audioPlayer.playNextVerse()"
            class="rounded-md p-1.5 text-muted-foreground active:scale-95"
            title="Ayat Berikutnya"
          >
            <SkipForward class="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            @click="isHifzModalOpen = true"
            class="rounded-md border border-border/80 px-2 py-1 text-[11px] font-medium transition-colors"
            :class="[
              audioStore.isHifzActive
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground'
            ]"
          >
            {{ audioStore.isHifzActive ? `Hifz ${audioStore.hifzCurrentRepeat}/${audioStore.hifzRepeatCount}` : 'Hifz' }}
          </button>
        </div>
      </div>

      <!-- Scrubber Timeline -->
      <div class="flex items-center gap-2.5 text-[11px] sm:text-xs text-muted-foreground font-mono">
        <span class="w-8 text-right shrink-0">{{ formatTime(audioStore.currentTime) }}</span>
        <input
          type="range"
          min="0"
          :max="audioStore.duration > 0 ? audioStore.duration : 1"
          step="0.1"
          :value="Math.min(audioStore.currentTime, audioStore.duration || 1)"
          @input="e => audioPlayer.seekTo(Number((e.target as HTMLInputElement).value))"
          class="h-1.5 w-full cursor-pointer rounded-lg bg-muted accent-primary"
          aria-label="Posisi pemutaran audio"
        />
        <span class="w-8 shrink-0">{{ formatTime(audioStore.duration) }}</span>
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
  </aside>
</template>

<script setup lang="ts">
import { Play, Pause, Repeat, FastForward, SkipBack, SkipForward, X } from '@lucide/vue';
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
  audioStore.startHifz(config.startKey, config.endKey, config.repeatCount, config.pauseGap);
  hifz.startLoop(audioStore.versesList, (url, key) => {
    audioPlayer.playVerse(url, key);
  });
};
</script>
