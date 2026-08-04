<template>
  <article :id="`verse-${verse.verse_key}`" :data-active="isActive">
    <header>
      <span>{{ verse.verse_key }}</span>
      <nav>
        <button type="button" @click="handlePlay">
          {{ isPlayingThisVerse ? 'Pause' : 'Putar Audio' }}
        </button>
        <button type="button" @click="handleBookmark">
          {{ isBookmarked ? 'Hapus Bookmark' : 'Tambah Bookmark' }}
        </button>
        <button type="button" @click="$emit('openTafsir', verse.verse_key)">
          Tafsir
        </button>
        <button type="button" @click="handleSetLastRead">
          Tandai Terakhir Dibaca
        </button>
      </nav>
    </header>

    <section>
      <p :style="{ fontSize: `${settings.arabicFontSize}px` }" dir="rtl">
        {{ verse.text_uthmani }}
      </p>

      <div v-if="settings.showLatin && latinText">
        <p>{{ latinText }}</p>
      </div>

      <div v-if="settings.showTranslation && translationText">
        <p :style="{ fontSize: `${settings.translationFontSize}px` }">
          {{ translationText }}
        </p>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/useSettingsStore';
import { useAudioStore } from '~/stores/useAudioStore';
import { useAudioPlayer } from '~/composables/useAudioPlayer';
import { useBookmarkStore } from '~/stores/useBookmarkStore';
import { stripHtmlTags } from '~/utils/quranValidation';
import type { Verse } from '~/types/quran';

const props = defineProps<{
  verse: Verse;
  surahName: string;
  chapterId: number;
}>();

defineEmits<{
  (e: 'openTafsir', verseKey: string): void;
}>();

const settings = useSettingsStore();
const audioStore = useAudioStore();
const audioPlayer = useAudioPlayer();
const bookmarkStore = useBookmarkStore();

const isActive = computed(() => audioStore.currentVerseKey === props.verse.verse_key);
const isPlayingThisVerse = computed(() => isActive.value && audioStore.isPlaying);
const isBookmarked = computed(() => bookmarkStore.isBookmarked(props.verse.verse_key));

const translationText = computed(() => {
  if (!props.verse.translations || props.verse.translations.length === 0) return '';
  return stripHtmlTags(props.verse.translations[0].text);
});

const latinText = computed(() => {
  if (!props.verse.words) return '';
  const rawText = props.verse.words
    .map(w => w.transliteration?.text || w.text_indonesian || '')
    .filter(Boolean)
    .join(' ');
  return stripHtmlTags(rawText);
});

const handlePlay = () => {
  if (isPlayingThisVerse.value) {
    audioPlayer.togglePlayPause();
  } else {
    const audioUrl = props.verse.audio?.url || '';
    if (audioUrl) {
      audioPlayer.playVerse(audioUrl, props.verse.verse_key);
    }
  }
};

const handleBookmark = () => {
  if (isBookmarked.value) {
    bookmarkStore.removeBookmark(props.verse.verse_key);
  } else {
    bookmarkStore.addBookmark({
      chapterId: props.chapterId,
      verseKey: props.verse.verse_key,
      verseNumber: props.verse.verse_number,
      surahName: props.surahName
    });
  }
};

const handleSetLastRead = () => {
  bookmarkStore.setLastRead({
    chapterId: props.chapterId,
    verseKey: props.verse.verse_key,
    surahName: props.surahName
  });
};
</script>
