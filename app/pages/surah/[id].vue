<template>
  <div class="page-container">
    <div v-if="pendingChapter || pendingVerses" class="space-y-4" role="status" aria-busy="true">
      <span class="sr-only">Memuat surah</span>
      <div class="h-40 animate-pulse rounded-lg bg-muted" />
      <div v-for="i in 5" :key="i" class="h-32 animate-pulse rounded-lg bg-muted" />
    </div>

    <div
      v-else-if="errorChapter || errorVerses || !chapterData?.chapter"
      role="alert"
      class="rounded-lg border border-destructive/40 p-8 text-center"
    >
      <p class="font-medium text-destructive">Gagal memuat data surah.</p>
      <NuxtLink
        to="/"
        class="mt-4 inline-flex h-10 items-center rounded-md border border-input px-4 text-sm font-medium hover:bg-muted"
      >
        Kembali ke beranda
      </NuxtLink>
    </div>

    <div v-else class="space-y-8">
      <header class="border-b border-border pb-6">
        <p class="eyebrow">
          Surah ke-{{ chapterData.chapter.id }} &middot;
          {{ chapterData.chapter.revelation_place === 'makkah' ? 'Makkiyah' : 'Madaniyah' }} &middot;
          {{ chapterData.chapter.verses_count }} ayat
        </p>

        <div class="mt-3 flex items-end justify-between gap-6">
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
            {{ chapterData.chapter.name_simple }}
            <span class="block text-base font-normal text-muted-foreground sm:text-lg">
              {{ chapterData.chapter.translated_name.name }}
            </span>
          </h1>
          <p class="quran-arabic text-4xl sm:text-5xl" lang="ar" dir="rtl">
            {{ chapterData.chapter.name_arabic }}
          </p>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            class="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
            @click="handlePlayFullSurah"
          >
            {{ isPlayingFullSurah ? 'Jeda murottal' : 'Putar murottal lengkap' }}
          </button>

          <nav aria-label="Navigasi surah" class="flex items-center gap-2 text-sm">
            <NuxtLink
              v-if="chapterId > 1"
              :to="`/surah/${chapterId - 1}`"
              rel="prev"
              class="inline-flex h-10 items-center rounded-md border border-input px-3 font-medium hover:bg-muted"
            >
              Surah sebelumnya
            </NuxtLink>
            <NuxtLink
              v-if="chapterId < 114"
              :to="`/surah/${chapterId + 1}`"
              rel="next"
              class="inline-flex h-10 items-center rounded-md border border-input px-3 font-medium hover:bg-muted"
            >
              Surah berikutnya
            </NuxtLink>
          </nav>
        </div>
      </header>

      <QuranReaderReadingModeSwitch />

      <div
        v-if="chapterData.chapter.bismillah_pre && settings.readingMode !== 'mushaf' && settings.readingMode !== 'zen'"
        class="py-4 text-center"
      >
        <p class="quran-arabic text-2xl sm:text-3xl text-foreground" lang="ar" dir="rtl">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>

      <section v-if="settings.readingMode === 'verse'" class="space-y-5">
        <QuranVerseItem
          v-for="verse in visibleVerses"
          :key="verse.id"
          :verse="verse"
          :surah-name="chapterData.chapter.name_simple"
          :chapter-id="chapterData.chapter.id"
          @open-tafsir="handleOpenTafsir"
          @inspect-word="handleInspectWord"
        />

        <div v-if="!isAllLoaded" class="py-6 text-center space-y-3">
          <div ref="sentinelRef" class="h-4 w-full" aria-hidden="true" />
          <div class="inline-flex items-center gap-3 rounded-full border border-border/70 bg-card px-4 py-2 text-xs text-muted-foreground shadow-xs">
            <span>Menampilkan {{ visibleCount }} dari {{ totalCount }} ayat</span>
            <button
              type="button"
              @click="loadAll"
              class="font-semibold text-primary hover:underline cursor-pointer"
            >
              Muat Semua Sekaligus
            </button>
          </div>
        </div>
      </section>

      <section v-else-if="settings.readingMode === 'mushaf'">
        <QuranReaderMushafPageView
          :verses="versesData?.verses || []"
          :surah-name="chapterData.chapter.name_simple"
          :has-bismillah="chapterData.chapter.bismillah_pre"
          @open-tafsir="handleOpenTafsir"
        />
      </section>

      <section v-else-if="settings.readingMode === 'zen'">
        <QuranReaderZenReaderView
          :verses="versesData?.verses || []"
          :surah-name="chapterData.chapter.name_simple"
          @exit="settings.setReadingMode('verse')"
        />
      </section>

      <section v-else-if="settings.readingMode === 'parallel'">
        <QuranReaderParallelView
          :verses="versesData?.verses || []"
          :surah-name="chapterData.chapter.name_simple"
          @open-tafsir="handleOpenTafsir"
        />
      </section>
    </div>

    <QuranTafsirModal
      :is-open="isTafsirOpen"
      :verse-key="selectedTafsirVerseKey"
      @close="isTafsirOpen = false"
    />

    <QuranMorphologyRootExplorerModal
      :is-open="isRootExplorerOpen"
      :raw-word="selectedWord"
      :verse-key="selectedWordVerseKey"
      @close="isRootExplorerOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuranApi } from '~/composables/useQuranApi';
import { useSettingsStore } from '~/stores/useSettingsStore';
import { useAudioStore } from '~/stores/useAudioStore';
import { useAudioPlayer } from '~/composables/useAudioPlayer';
import type { Word } from '~/types/quran';

const route = useRoute();
const rawChapterId = Number(route.params.id);

// Fail-fast boundary validation (Defensive Programming)
if (isNaN(rawChapterId) || rawChapterId < 1 || rawChapterId > 114) {
  throw createError({
    statusCode: 404,
    statusMessage: `Surah ${route.params.id} tidak ditemukan. Al-Qur'an terdiri dari Surah 1 hingga 114.`,
    fatal: true
  });
}

const chapterId = computed(() => rawChapterId);

const quranApi = useQuranApi();
const settings = useSettingsStore();
const audioStore = useAudioStore();
const audioPlayer = useAudioPlayer();

const isTafsirOpen = ref(false);
const selectedTafsirVerseKey = ref('');

const isRootExplorerOpen = ref(false);
const selectedWord = ref<Word | null>(null);
const selectedWordVerseKey = ref('');

const modes = [
  { id: 'verse', label: 'Ayat' },
  { id: 'mushaf', label: 'Mushaf' },
  { id: 'zen', label: 'Zen' },
  { id: 'parallel', label: 'Komparasi' }
];

const { data: chapterData, pending: pendingChapter, error: errorChapter } = await useAsyncData(
  () => `chapter-${chapterId.value}`,
  async () => {
    const res = await quranApi.getChapter(chapterId.value);
    if (!res?.chapter) {
      throw createError({
        statusCode: 404,
        statusMessage: `Data Surah ${chapterId.value} tidak ditemukan.`,
        fatal: true
      });
    }
    return res;
  }
);

const { data: versesData, pending: pendingVerses, error: errorVerses } = await useAsyncData(
  () => `verses-${chapterId.value}-${settings.selectedReciterId}`,
  () => quranApi.getVersesByChapter(chapterId.value, {
    reciterId: settings.selectedReciterId,
    perPage: 300
  }),
  {
    watch: [() => settings.selectedReciterId]
  }
);

const allVerses = computed(() => versesData.value?.verses || []);
const {
  visibleVerses,
  visibleCount,
  totalCount,
  isAllLoaded,
  sentinelRef,
  loadAll
} = useProgressiveVerses(allVerses, { initialBatch: 25, batchStep: 25 });

watch(() => versesData.value?.verses, (newVerses) => {
  if (newVerses && newVerses.length > 0) {
    audioStore.setVersesList(newVerses);
  }
}, { immediate: true });

const isPlayingFullSurah = computed(() => {
  return audioStore.currentChapterId === chapterId.value && audioStore.isPlaying && !audioStore.currentVerseKey;
});

const handlePlayFullSurah = async () => {
  if (isPlayingFullSurah.value) {
    audioPlayer.togglePlayPause();
  } else {
    try {
      const recitationRes = await quranApi.getChapterRecitation(settings.selectedReciterId, chapterId.value);
      if (recitationRes?.audio_file?.audio_url) {
        audioStore.setAudioSource(
          recitationRes.audio_file.audio_url,
          chapterId.value,
          versesData.value?.verses || [],
          recitationRes.audio_file
        );
        audioPlayer.playVerse(recitationRes.audio_file.audio_url, `${chapterId.value}:1`);
      }
    } catch (err) {
      console.error(err);
    }
  }
};

const handleOpenTafsir = (verseKey: string) => {
  selectedTafsirVerseKey.value = verseKey;
  isTafsirOpen.value = true;
};

const handleInspectWord = (word: Word, verseKey: string) => {
  selectedWord.value = word;
  selectedWordVerseKey.value = verseKey;
  isRootExplorerOpen.value = true;
};

useSeoMeta({
  title: () => {
    const ch = chapterData.value?.chapter;
    return ch
      ? `Surah ${ch.name_simple} (${ch.translated_name.name}) — Al-Qur'an Digital`
      : `Surah ${chapterId.value} — Al-Qur'an Digital`;
  },
  description: () => {
    const ch = chapterData.value?.chapter;
    if (!ch) return 'Baca dan pelajari ayat-ayat Al-Qur\'an.';
    const place = ch.revelation_place === 'makkah' ? 'Makkiyah' : 'Madaniyah';
    return `Baca Surah ${ch.name_simple} (${ch.name_arabic}) terdiri dari ${ch.verses_count} ayat. Golongan ${place}. Dilengkapi teks Utsmani, terjemahan Kemenag RI, tafsir komparatif, dan audio tilawah.`;
  },
  ogTitle: () => {
    const ch = chapterData.value?.chapter;
    return ch
      ? `Surah ${ch.name_simple} (${ch.name_arabic}) — ${ch.translated_name.name}`
      : `Surah ${chapterId.value}`;
  },
  ogDescription: () => {
    const ch = chapterData.value?.chapter;
    return ch
      ? `Baca Surah ${ch.name_simple} (${ch.verses_count} Ayat) dengan terjemahan resmi, tafsir, dan audio tilawah.`
      : 'Al-Qur\'an Digital';
  },
  ogType: 'article',
  twitterCard: 'summary_large_image'
});
</script>