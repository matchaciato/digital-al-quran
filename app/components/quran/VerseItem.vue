<template>
  <article
    :id="`verse-${verse.verse_key}`"
    :data-active="isActive"
    class="group relative rounded-xl border p-5 sm:p-7 transition-all duration-200 verse-card-optimized"
    :class="[
      isActive
        ? 'border-primary bg-primary/5 shadow-sm'
        : 'border-border/60 bg-card hover:border-border'
    ]"
  >
    <header class="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3 text-xs">
      <div class="flex items-center gap-2">
        <span class="rounded-md bg-muted px-2 py-1 font-semibold text-foreground">
          {{ verse.verse_key }}
        </span>
        <span v-if="verse.juz_number" class="text-muted-foreground">
          Juz {{ verse.juz_number }} &bull; Halaman {{ verse.page_number }}
        </span>
      </div>

      <nav class="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          @click="handlePlay"
          class="rounded-md px-2.5 py-1 font-medium transition-colors"
          :class="[
            isPlayingThisVerse
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
        >
          {{ isPlayingThisVerse ? 'Jeda' : 'Putar' }}
        </button>

        <button
          type="button"
          @click="$emit('openTafsir', verse.verse_key)"
          class="rounded-md px-2.5 py-1 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {{ t('reader.tafsir') }}
        </button>

        <button
          type="button"
          @click="isQuickTadabburOpen = true"
          class="relative rounded-md px-2.5 py-1 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground inline-flex items-center gap-1.5"
          :title="hasTadabburNote ? 'Lihat catatan tadabbur' : 'Catat refleksi tadabbur'"
        >
          <span v-if="hasTadabburNote" class="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Refleksi</span>
        </button>

        <button
          type="button"
          @click="isExportCardOpen = true"
          class="rounded-md px-2.5 py-1 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Kartu
        </button>

        <button
          type="button"
          @click="handleBookmark"
          class="rounded-md px-2.5 py-1 font-medium transition-colors"
          :class="[
            isBookmarked
              ? 'text-primary font-semibold'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          ]"
        >
          {{ isBookmarked ? t('reader.bookmarked') : t('reader.bookmark') }}
        </button>

        <button
          type="button"
          @click="handleSetLastRead"
          class="hidden rounded-md px-2.5 py-1 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-block"
        >
          Terakhir Dibaca
        </button>

        <button
          type="button"
          @click="handleCopy"
          class="rounded-md px-2 py-1 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {{ copied ? t('reader.copied') : t('reader.copy') }}
        </button>
      </nav>
    </header>

    <section class="space-y-6 pt-6">
      <!-- Arabic Text (with interactive word tokens if available) -->
      <div
        class="quran-arabic text-right text-foreground select-text leading-[2.4]"
        :style="{ fontSize: `${settings.arabicFontSize}px` }"
        dir="rtl"
      >
        <template v-if="verse.words && verse.words.length > 0">
          <QuranVerseWordToken
            v-for="word in verse.words"
            :key="word.id"
            :word="word"
            :verse-key="verse.verse_key"
            @inspect="w => $emit('inspectWord', w, verse.verse_key)"
          />
        </template>
        <template v-else>
          {{ verse.text_uthmani }}
        </template>
        <span class="ayah-end-glyph text-primary font-normal select-none px-1">
          {{ formatAyahGlyph(verse.verse_number) }}
        </span>
      </div>

      <!-- Transliteration Latin -->
      <div v-if="settings.showLatin && latinText" class="pt-1">
        <p class="text-sm font-medium italic text-muted-foreground leading-relaxed">
          {{ latinText }}
        </p>
      </div>

      <!-- Translation -->
      <div v-if="settings.showTranslation && translationText" class="pt-1">
        <p
          class="text-foreground/90 leading-relaxed"
          :style="{ fontSize: `${settings.translationFontSize}px` }"
        >
          {{ translationText }}
        </p>
      </div>
    </section>

    <QuranExportAyatCardExportModal
      v-if="isExportCardOpen"
      :is-open="isExportCardOpen"
      :verse="verse"
      :surah-name="surahName"
      @close="isExportCardOpen = false"
    />

    <QuranVerseQuickTadabburModal
      v-if="isQuickTadabburOpen"
      :is-open="isQuickTadabburOpen"
      :verse-key="verse.verse_key"
      :surah-name="surahName"
      :surah-id="chapterId"
      @close="isQuickTadabburOpen = false"
    />
  </article>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/useSettingsStore';
import { useAudioStore } from '~/stores/useAudioStore';
import { useAudioPlayer } from '~/composables/useAudioPlayer';
import { useBookmarkStore } from '~/stores/useBookmarkStore';
import { useTadabburStore } from '~/stores/useTadabburStore';
import { useI18n } from '~/composables/useI18n';
import { stripHtmlTags } from '~/utils/quranValidation';
import { formatAyahGlyph } from '~/utils/arabicFormatters';
import type { Verse, Word } from '~/types/quran';

const props = defineProps<{
  verse: Verse;
  surahName: string;
  chapterId: number;
}>();

defineEmits<{
  (e: 'openTafsir', verseKey: string): void;
  (e: 'inspectWord', word: Word, verseKey: string): void;
}>();

const settings = useSettingsStore();
const audioStore = useAudioStore();
const audioPlayer = useAudioPlayer();
const bookmarkStore = useBookmarkStore();
const tadabburStore = useTadabburStore();
const { t } = useI18n();

const copied = ref(false);
const isExportCardOpen = ref(false);
const isQuickTadabburOpen = ref(false);

const isActive = computed(() => audioStore.currentVerseKey === props.verse.verse_key);
const isPlayingThisVerse = computed(() => isActive.value && audioStore.isPlaying);
const isBookmarked = computed(() => bookmarkStore.isBookmarked(props.verse.verse_key));
const hasTadabburNote = computed(() => tadabburStore.notes.some(n => n.verseKey === props.verse.verse_key));

const translationText = computed(() => {
  if (!props.verse.translations || props.verse.translations.length === 0) return '';
  return stripHtmlTags(props.verse.translations[0]?.text || '');
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
    audioPlayer.playVerse(props.verse.audio?.url, props.verse.verse_key);
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

const handleCopy = async () => {
  const content = `${props.verse.text_uthmani} ${formatAyahGlyph(props.verse.verse_number)}\n\n"${translationText.value}" (QS. ${props.surahName}: ${props.verse.verse_number})`;
  try {
    await navigator.clipboard.writeText(content);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (e) {
    console.error('Failed to copy text', e);
  }
};
</script>
