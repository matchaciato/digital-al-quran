<template>
  <div class="mx-auto w-full max-w-6xl space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4 text-xs">
      <div class="space-y-0.5">
        <h2 class="font-semibold text-foreground text-sm">Mode Komparasi Terjemahan</h2>
        <p class="text-muted-foreground">Bandingkan terjemahan Bahasa Indonesia (Kemenag RI) dan Internasional (Sahih International)</p>
      </div>

      <div class="flex items-center gap-2">
        <span class="rounded bg-primary/10 px-2 py-1 font-medium text-primary">Kemenag RI (ID)</span>
        <span class="text-muted-foreground">&bull;</span>
        <span class="rounded bg-muted px-2 py-1 font-medium text-foreground">Sahih Intl (EN)</span>
      </div>
    </header>

    <div class="space-y-6">
      <article
        v-for="verse in verses"
        :key="verse.id"
        :id="`parallel-verse-${verse.verse_key}`"
        class="rounded-xl border p-5 sm:p-7 transition-all"
        :class="[
          activeVerseKey === verse.verse_key
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-border/70 bg-card hover:border-border'
        ]"
      >
        <div class="flex items-center justify-between border-b border-border/40 pb-3 text-xs">
          <span class="rounded bg-muted px-2 py-1 font-bold text-foreground">
            {{ verse.verse_key }}
          </span>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="handlePlayVerse(verse)"
              class="rounded-md px-2.5 py-1 font-medium transition-colors"
              :class="[
                activeVerseKey === verse.verse_key && isPlaying
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              ]"
            >
              {{ activeVerseKey === verse.verse_key && isPlaying ? 'Jeda' : 'Putar' }}
            </button>
            <button
              type="button"
              @click="$emit('openTafsir', verse.verse_key)"
              class="rounded-md px-2.5 py-1 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Tafsir
            </button>
          </div>
        </div>

        <p
          class="quran-arabic pt-5 text-right text-foreground"
          :style="{ fontSize: `${settings.arabicFontSize}px` }"
          dir="rtl"
        >
          {{ verse.text_uthmani }}
          <span class="ayah-end-glyph text-primary/80 font-normal select-none px-1">
            {{ formatAyahGlyph(verse.verse_number) }}
          </span>
        </p>

        <div class="mt-6 grid gap-4 border-t border-border/40 pt-5 md:grid-cols-2">
          <div class="rounded-lg border border-border/50 bg-background/50 p-4 space-y-1.5">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Bahasa Indonesia (Kemenag RI)
            </span>
            <p
              class="text-foreground/90 leading-relaxed"
              :style="{ fontSize: `${settings.translationFontSize}px` }"
            >
              {{ getPrimaryTranslation(verse) }}
            </p>
          </div>

          <div class="rounded-lg border border-border/50 bg-background/50 p-4 space-y-1.5">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              English (Sahih International / Clear Quran)
            </span>
            <p
              class="text-foreground/90 leading-relaxed italic"
              :style="{ fontSize: `${settings.translationFontSize}px` }"
            >
              {{ getSecondaryTranslation(verse) }}
            </p>
          </div>
        </div>
      </article>
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
}>();

defineEmits<{
  (e: 'openTafsir', verseKey: string): void;
}>();

const settings = useSettingsStore();
const audioStore = useAudioStore();
const audioPlayer = useAudioPlayer();

const activeVerseKey = computed(() => audioStore.currentVerseKey);
const isPlaying = computed(() => audioStore.isPlaying);

const getPrimaryTranslation = (verse: Verse): string => {
  if (!verse.translations || verse.translations.length === 0) return 'Terjemahan tidak tersedia';
  return stripHtmlTags(verse.translations[0]?.text || '');
};

const getSecondaryTranslation = (verse: Verse): string => {
  if (verse.translations && verse.translations.length > 1) {
    return stripHtmlTags(verse.translations[1]?.text || '');
  }
  if (verse.words && verse.words.length > 0) {
    const enText = verse.words.map(w => w.translation?.text || '').filter(Boolean).join(' ');
    if (enText) return stripHtmlTags(enText);
  }
  return stripHtmlTags(verse.translations?.[0]?.text || 'Translation unavailable');
};

const handlePlayVerse = (verse: Verse) => {
  const isThisPlaying = activeVerseKey.value === verse.verse_key && isPlaying.value;
  if (isThisPlaying) {
    audioPlayer.togglePlayPause();
  } else {
    const audioUrl = verse.audio?.url || '';
    if (audioUrl) {
      audioPlayer.playVerse(audioUrl, verse.verse_key);
    }
  }
};
</script>
