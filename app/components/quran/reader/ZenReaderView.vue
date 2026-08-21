<template>
  <div class="fixed inset-0 z-50 flex flex-col justify-between bg-background p-6 sm:p-12 overflow-y-auto">
    <header class="flex items-center justify-between border-b border-border/40 pb-4">
      <div class="flex items-center gap-3">
        <span class="text-sm font-semibold text-foreground">{{ surahName }}</span>
        <span class="text-xs text-muted-foreground">• Mode Zen</span>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-xs font-mono text-muted-foreground">
          Waktu Tilawah: {{ formattedTimer }}
        </span>

        <button
          type="button"
          @click="$emit('exit')"
          class="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted active:scale-95"
        >
          Keluar (Esc)
        </button>
      </div>
    </header>

    <main class="my-auto mx-auto w-full max-w-4xl py-12 text-center space-y-16">
      <template v-for="verse in verses" :key="verse.id">
        <div
          :id="`zen-verse-${verse.verse_key}`"
          @click="handlePlayVerse(verse)"
          class="cursor-pointer rounded-2xl p-6 sm:p-8 transition-all duration-300"
          :class="[
            activeVerseKey === verse.verse_key
              ? 'bg-primary/10 scale-[1.02] shadow-sm'
              : 'opacity-70 hover:opacity-100'
          ]"
        >
          <p
            class="quran-arabic text-center text-foreground leading-[2.8]"
            :style="{ fontSize: `${Math.max(28, settings.arabicFontSize + 4)}px` }"
            dir="rtl"
          >
            {{ verse.text_uthmani }}
            <span class="ayah-end-glyph text-primary font-normal select-none px-2">
              {{ formatAyahGlyph(verse.verse_number) }}
            </span>
          </p>

          <p
            v-if="settings.showTranslation && verse.translations?.[0]?.text"
            class="mt-4 text-sm text-muted-foreground/80 max-w-2xl mx-auto"
          >
            {{ stripHtmlTags(verse.translations[0].text) }}
          </p>
        </div>
      </template>
    </main>

    <footer class="flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
      <span>Tekan ayat mana pun untuk mulai melantunkan</span>
      <div class="flex items-center gap-2">
        <span>Ayat Aktif: {{ activeVerseKey || '1:1' }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/useSettingsStore';
import { useAudioStore } from '~/stores/useAudioStore';
import { useAudioPlayer } from '~/composables/useAudioPlayer';
import { formatAyahGlyph } from '~/utils/arabicFormatters';
import { stripHtmlTags } from '~/utils/quranValidation';
import type { Verse } from '~/types/quran';

const props = defineProps<{
  verses: Verse[];
  surahName: string;
}>();

const emit = defineEmits<{
  (e: 'exit'): void;
}>();

const settings = useSettingsStore();
const audioStore = useAudioStore();
const audioPlayer = useAudioPlayer();

const secondsElapsed = ref(0);
let timerInterval: ReturnType<typeof setInterval> | null = null;

const activeVerseKey = computed(() => audioStore.currentVerseKey);

const formattedTimer = computed(() => {
  const mins = Math.floor(secondsElapsed.value / 60);
  const secs = secondsElapsed.value % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
});

const handlePlayVerse = (verse: Verse) => {
  if (audioStore.currentVerseKey === verse.verse_key && audioStore.isPlaying) {
    audioPlayer.togglePlayPause();
  } else {
    audioPlayer.playVerse(verse.audio?.url, verse.verse_key);
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('exit');
  }
};

onMounted(() => {
  timerInterval = setInterval(() => {
    secondsElapsed.value++;
  }, 1000);
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
