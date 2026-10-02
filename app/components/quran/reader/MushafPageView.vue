<template>
  <div class="mx-auto w-full max-w-4xl space-y-6">
    <!-- Top Control Bar: Mode Toggle & Page Switcher -->
    <header class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-3.5 text-xs shadow-2xs">
      <!-- Page Navigation (Single Page Mode) -->
      <div v-if="isSinglePageMode && pages.length > 1" class="flex items-center gap-2">
        <button
          type="button"
          :disabled="selectedPageIndex === 0"
          @click="selectedPageIndex--"
          class="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-medium transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          title="Halaman Sebelumnya"
        >
          &larr; <span class="hidden sm:inline">Sebelumnya</span>
        </button>

        <select
          v-model="selectedPageIndex"
          class="rounded-md border border-border bg-background px-2.5 py-1.5 font-medium text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option v-for="(p, idx) in pages" :key="p.pageNumber" :value="idx">
            Hal. {{ p.pageNumber }} (Juz {{ p.juzNumber }})
          </option>
        </select>

        <button
          type="button"
          :disabled="selectedPageIndex >= pages.length - 1"
          @click="selectedPageIndex++"
          class="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-medium transition-colors hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed"
          title="Halaman Berikutnya"
        >
          <span class="hidden sm:inline">Berikutnya</span> &rarr;
        </button>
      </div>

      <!-- General Meta Info -->
      <div v-else class="flex items-center gap-2 text-muted-foreground">
        <span class="font-semibold text-foreground">
          {{ displayHeaderTitle }}
        </span>
        <span>&bull;</span>
        <span>Total {{ pages.length }} Halaman Mushaf</span>
      </div>

      <!-- Mode View Toggle (Per Halaman vs Semua Halaman) -->
      <div class="flex items-center gap-2">
        <div class="inline-flex rounded-lg border border-border bg-muted/40 p-0.5">
          <button
            type="button"
            @click="isSinglePageMode = true"
            :class="[
              isSinglePageMode
                ? 'bg-card text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            ]"
            class="rounded-md px-2.5 py-1 text-[11px] transition-all"
          >
            Per Halaman
          </button>
          <button
            type="button"
            @click="isSinglePageMode = false"
            :class="[
              !isSinglePageMode
                ? 'bg-card text-foreground shadow-2xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            ]"
            class="rounded-md px-2.5 py-1 text-[11px] transition-all"
          >
            Semua Halaman
          </button>
        </div>
      </div>
    </header>

    <!-- Mushaf Pages Container -->
    <div class="space-y-10">
      <article
        v-for="page in displayedPages"
        :key="page.pageNumber"
        :id="`mushaf-page-${page.pageNumber}`"
        class="relative overflow-hidden rounded-2xl border-2 border-primary/25 bg-card p-6 sm:p-12 shadow-sm transition-all dark:border-primary/35"
      >
        <!-- Authentic Classical Header Margin Ribbon -->
        <div class="flex items-center justify-between border-b border-primary/20 pb-3 text-xs text-muted-foreground">
          <span class="font-semibold text-foreground">
            {{ page.surahNames.join(' • ') }}
          </span>

          <div class="hidden sm:flex items-center gap-1.5 text-primary/70 font-serif">
            <span>۞</span>
            <span class="text-[11px] uppercase tracking-wider font-sans text-muted-foreground">Mushaf Madinah</span>
            <span>۞</span>
          </div>

          <span class="font-medium text-foreground">
            Juz {{ page.juzNumber }}
          </span>
        </div>

        <!-- Bismillah Header (if applicable on this page) -->
        <div v-if="page.hasBismillah" class="my-6 text-center">
          <div class="inline-block rounded-xl border border-primary/20 bg-primary/5 px-6 py-2">
            <p class="quran-arabic text-2xl sm:text-3xl text-foreground" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        </div>

        <!-- Justified Arabic Quran Text Flow -->
        <div
          class="quran-arabic text-justify text-foreground leading-[2.7] sm:leading-[3.0] pt-4"
          :style="{ fontSize: `${Math.max(22, settings.arabicFontSize)}px` }"
          dir="rtl"
        >
          <template v-for="verse in page.verses" :key="verse.id">
            <span
              :id="`mushaf-verse-${verse.verse_key}`"
              @click="handleSelectVerse(verse)"
              class="cursor-pointer rounded px-1 transition-colors hover:bg-primary/10 select-text"
              :class="[
                activeVerseKey === verse.verse_key
                  ? 'bg-primary/20 text-primary font-semibold ring-1 ring-primary/40'
                  : selectedVerse?.verse_key === verse.verse_key
                    ? 'bg-muted text-foreground ring-1 ring-border'
                    : ''
              ]"
              :title="`Ayat ${verse.verse_key} — Klik untuk aksi cepat`"
            >
              {{ verse.text_uthmani }}
              <span class="ayah-end-glyph text-primary/80 font-normal select-none px-1">
                {{ formatAyahGlyph(verse.verse_number) }}
              </span>
            </span>
          </template>
        </div>

        <!-- Authentic Classical Footer Margin: Page Number -->
        <div class="mt-8 flex items-center justify-center border-t border-primary/20 pt-4 text-xs">
          <div class="inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-4 py-1 text-muted-foreground">
            <span>—</span>
            <span class="font-semibold text-foreground">{{ page.pageNumber }}</span>
            <span>—</span>
          </div>
        </div>
      </article>
    </div>

    <!-- Floating Interactive Bottom Dock for Selected Verse -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-6 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-6 opacity-0"
    >
      <div
        v-if="selectedVerse"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-3xl rounded-2xl border border-border/80 bg-card/95 p-4 shadow-xl backdrop-blur-md transition-all space-y-3"
      >
        <div class="flex items-start justify-between gap-3 border-b border-border/40 pb-2.5">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                QS. {{ selectedSurahName }} ({{ selectedVerse.verse_key }})
              </span>
              <span class="text-xs text-muted-foreground">
                Halaman {{ selectedVerse.page_number }} &bull; Juz {{ selectedVerse.juz_number }}
              </span>
            </div>
            <p v-if="selectedVerseTranslation" class="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              "{{ selectedVerseTranslation }}"
            </p>
          </div>

          <button
            type="button"
            @click="selectedVerse = null"
            class="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Tutup Bilah Aksi"
          >
            ✕
          </button>
        </div>

        <!-- Action Buttons Grid -->
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              @click="handlePlaySelected"
              class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-95"
              :class="isSelectedPlaying ? 'bg-amber-600' : 'bg-primary'"
            >
              {{ isSelectedPlaying ? '⏸ Jeda Tilawah' : '▶ Putar Ayat Ini' }}
            </button>

            <button
              type="button"
              @click="$emit('openTafsir', selectedVerse.verse_key)"
              class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-foreground hover:bg-muted active:scale-95"
            >
              📖 Buka Tafsir
            </button>

            <button
              type="button"
              @click="handleToggleBookmark"
              class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-medium transition-colors active:scale-95"
              :class="[
                isBookmarked
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border bg-card text-foreground hover:bg-muted'
              ]"
            >
              {{ isBookmarked ? '★ Ditandai' : '☆ Bookmark' }}
            </button>

            <button
              type="button"
              @click="handleMarkLastRead"
              class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 font-medium text-foreground hover:bg-muted active:scale-95"
              title="Tandai sebagai terakhir dibaca"
            >
              🔖 Terakhir Dibaca
            </button>
          </div>

          <button
            type="button"
            @click="handleCopyVerse"
            class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-1.5 font-medium text-foreground hover:bg-muted active:scale-95"
          >
            {{ copied ? '✓ Tersalin!' : '📋 Salin Teks' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/useSettingsStore';
import { useAudioStore } from '~/stores/useAudioStore';
import { useAudioPlayer } from '~/composables/useAudioPlayer';
import { useBookmarkStore } from '~/stores/useBookmarkStore';
import { getSurahName } from '~/constants/surahs';
import { formatAyahGlyph } from '~/utils/arabicFormatters';
import { stripHtmlTags } from '~/utils/quranValidation';
import type { Verse } from '~/types/quran';

interface MushafPage {
  pageNumber: number;
  juzNumber: number;
  surahNames: string[];
  verses: Verse[];
  hasBismillah: boolean;
}

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
const bookmarkStore = useBookmarkStore();

const isSinglePageMode = ref(true);
const selectedPageIndex = ref(0);
const selectedVerse = ref<Verse | null>(null);
const copied = ref(false);

const activeVerseKey = computed(() => audioStore.currentVerseKey);

// Group verses by authentic page_number (Mushaf Madinah 604 pages)
const pages = computed<MushafPage[]>(() => {
  if (!props.verses || props.verses.length === 0) return [];

  const map = new Map<number, Verse[]>();
  for (const v of props.verses) {
    const pageNum = v.page_number || 1;
    if (!map.has(pageNum)) {
      map.set(pageNum, []);
    }
    map.get(pageNum)!.push(v);
  }

  const result: MushafPage[] = [];
  for (const [pageNum, pageVerses] of map.entries()) {
    const juz = pageVerses[0]?.juz_number || 1;
    const surahSet = new Set<string>();

    for (const v of pageVerses) {
      surahSet.add(getSurahName(v.verse_key, props.surahName));
    }

    const hasVerseOne = pageVerses.some(v => {
      const chapterId = Number(v.verse_key.split(':')[0]);
      return v.verse_number === 1 && chapterId !== 9 && chapterId !== 1;
    });

    result.push({
      pageNumber: pageNum,
      juzNumber: juz,
      surahNames: Array.from(surahSet),
      verses: pageVerses,
      hasBismillah: hasVerseOne || (Boolean(props.hasBismillah) && pageVerses[0]?.verse_number === 1)
    });
  }

  return result.sort((a, b) => a.pageNumber - b.pageNumber);
});

const displayedPages = computed(() => {
  if (!isSinglePageMode.value) {
    return pages.value;
  }
  const curr = pages.value[selectedPageIndex.value];
  return curr ? [curr] : pages.value.slice(0, 1);
});

const displayHeaderTitle = computed(() => {
  if (pages.value.length === 0) return props.surahName;
  const curr = pages.value[selectedPageIndex.value] || pages.value[0];
  return `${curr.surahNames.join(', ')} • Juz ${curr.juzNumber}`;
});

// Auto-navigate page index if active recitation verse moves to another page
watch(() => audioStore.currentVerseKey, (newKey) => {
  if (!newKey || !isSinglePageMode.value) return;
  const targetPageIdx = pages.value.findIndex(p => p.verses.some(v => v.verse_key === newKey));
  if (targetPageIdx !== -1 && targetPageIdx !== selectedPageIndex.value) {
    selectedPageIndex.value = targetPageIdx;
  }
});

const selectedSurahName = computed(() => {
  if (!selectedVerse.value) return props.surahName;
  return getSurahName(selectedVerse.value.verse_key, props.surahName);
});

const selectedVerseTranslation = computed(() => {
  if (!selectedVerse.value?.translations || selectedVerse.value.translations.length === 0) return '';
  return stripHtmlTags(selectedVerse.value.translations[0]?.text || '');
});

const isSelectedPlaying = computed(() => {
  return (
    Boolean(selectedVerse.value) &&
    audioStore.currentVerseKey === selectedVerse.value?.verse_key &&
    audioStore.isPlaying
  );
});

const isBookmarked = computed(() => {
  if (!selectedVerse.value) return false;
  return bookmarkStore.isBookmarked(selectedVerse.value.verse_key);
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

const handleToggleBookmark = () => {
  if (!selectedVerse.value) return;
  const key = selectedVerse.value.verse_key;
  if (isBookmarked.value) {
    bookmarkStore.removeBookmark(key);
  } else {
    const chapterId = Number(key.split(':')[0]);
    bookmarkStore.addBookmark({
      chapterId,
      verseKey: key,
      verseNumber: selectedVerse.value.verse_number,
      surahName: selectedSurahName.value
    });
  }
};

const handleMarkLastRead = () => {
  if (!selectedVerse.value) return;
  const key = selectedVerse.value.verse_key;
  const chapterId = Number(key.split(':')[0]);
  bookmarkStore.setLastRead({
    chapterId,
    verseKey: key,
    surahName: selectedSurahName.value
  });
};

const handleCopyVerse = async () => {
  if (!selectedVerse.value || !import.meta.client) return;
  const v = selectedVerse.value;
  const sName = selectedSurahName.value;
  const text = `${v.text_uthmani}\n\n"${selectedVerseTranslation.value}"\n(QS. ${sName}: ${v.verse_number})`;
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Gagal menyalin teks ayat:', err);
  }
};
</script>
