<template>
  <div class="mx-auto w-full max-w-4xl space-y-6">
    <header class="flex items-center justify-between border-b border-border/60 pb-3 text-xs text-muted-foreground">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-foreground">Juz {{ currentJuz }}</span>
        <span>•</span>
        <span>{{ surahName }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span>Halaman {{ currentPage }} / 604</span>
      </div>
    </header>

    <div
      class="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm transition-all"
    >
      <div v-if="hasBismillah" class="mb-8 text-center">
        <p class="quran-arabic text-2xl sm:text-3xl text-foreground" dir="rtl">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>

      <div
        class="quran-arabic text-justify text-foreground leading-[2.6] sm:leading-[2.8]"
        :style="{ fontSize: `${Math.max(22, settings.arabicFontSize)}px` }"
        dir="rtl"
      >
        <template v-for="verse in verses" :key="verse.id">
          <span
            :id="`mushaf-verse-${verse.verse_key}`"
            @click="handleSelectVerse(verse)"
            class="cursor-pointer rounded px-1 transition-colors hover:bg-primary/10"
            :class="[
              activeVerseKey === verse.verse_key
                ? 'bg-primary/20 text-primary font-semibold'
                : ''
            ]"
            :title="`Ayat ${verse.verse_key}`"
          >
            {{ verse.text_uthmani }}
            <span class="ayah-end-glyph text-primary/80 font-normal select-none px-1">
              {{ formatAyahGlyph(verse.verse_number) }}
            </span>
          </span>
        </template>
      </div>
    </div>

    <div
      v-if="selectedVerse"
      class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 p-4 transition-all"
    >
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
            Ayat {{ selectedVerse.verse_key }}
          </span>
          <span v-if="selectedVerseTranslation" class="text-xs text-muted-foreground line-clamp-1 max-w-md">
            {{ selectedVerseTranslation }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="handlePlaySelected"
          class="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-95"
        >
          {{ isSelectedPlaying ? 'Jeda Audio' : 'Putar Ayat Ini' }}
        </button>
        <button
          type="button"
          @click="$emit('openTafsir', selectedVerse.verse_key)"
          class="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          Buka Tafsir
        </button>
        <button
          type="button"
          @click="selectedVerse = null"
          class="rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          Tutup
        </button>
      </div>
    </div>
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
  hasBismillah?: boolean;
}>();

defineEmits<{
  (e: 'openTafsir', verseKey: string): void;
}>();

const settings = useSettingsStore();
const audioStore = useAudioStore();
const audioPlayer = useAudioPlayer();

const selectedVerse = ref<Verse | null>(null);

const activeVerseKey = computed(() => audioStore.currentVerseKey);
const isSelectedPlaying = computed(() => {
  return selectedVerse.value && audioStore.currentVerseKey === selectedVerse.value.verse_key && audioStore.isPlaying;
});

const currentJuz = computed(() => props.verses[0]?.juz_number || 1);
const currentPage = computed(() => props.verses[0]?.page_number || 1);

const selectedVerseTranslation = computed(() => {
  if (!selectedVerse.value?.translations || selectedVerse.value.translations.length === 0) return '';
  return stripHtmlTags(selectedVerse.value.translations[0]?.text || '');
});

const handleSelectVerse = (verse: Verse) => {
  selectedVerse.value = verse;
};

const handlePlaySelected = () => {
  if (!selectedVerse.value) return;
  if (isSelectedPlaying.value) {
    audioPlayer.togglePlayPause();
  } else {
    audioPlayer.playVerse(selectedVerse.value.audio?.url, selectedVerse.value.verse_key);
  }
};
</script>
