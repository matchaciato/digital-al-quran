<template>
  <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div v-if="pendingChapter || pendingVerses" class="space-y-6">
      <div class="h-40 animate-pulse rounded-2xl border border-border/50 bg-muted/30" />
      <div v-for="i in 5" :key="i" class="h-32 animate-pulse rounded-xl border border-border/50 bg-muted/20" />
    </div>

    <div
      v-else-if="errorChapter || errorVerses || !chapterData?.chapter"
      class="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center"
    >
      <p class="text-sm font-medium text-destructive">Gagal memuat data surah.</p>
      <NuxtLink
        to="/"
        class="mt-3 inline-block rounded-md bg-muted px-4 py-2 text-xs font-medium text-foreground hover:bg-border"
      >
        &larr; Kembali ke Beranda
      </NuxtLink>
    </div>

    <div v-else class="space-y-8">
      <header
        class="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs"
      >
        <div class="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div class="space-y-1.5">
            <div class="flex items-center gap-2">
              <span class="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                Surah ke-{{ chapterData.chapter.id }}
              </span>
              <span class="text-xs text-muted-foreground capitalize">
                {{ chapterData.chapter.revelation_place === 'makkah' ? 'Makkiyah' : 'Madaniyah' }}
              </span>
              <span class="text-xs text-muted-foreground">• {{ chapterData.chapter.verses_count }} Ayat</span>
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {{ chapterData.chapter.name_simple }}
              <span class="text-base font-normal text-muted-foreground">
                ({{ chapterData.chapter.translated_name.name }})
              </span>
            </h1>
          </div>

          <div class="text-right">
            <span class="quran-arabic text-4xl sm:text-5xl font-normal text-foreground" dir="rtl">
              {{ chapterData.chapter.name_arabic }}
            </span>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-4">
          <button
            type="button"
            @click="handlePlayFullSurah"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
          >
            {{ isPlayingFullSurah ? 'Jeda Murottal Surah' : 'Putar Murottal Lengkap' }}
          </button>

          <div class="flex items-center gap-2 text-xs">
            <NuxtLink
              v-if="chapterId > 1"
              :to="`/surah/${chapterId - 1}`"
              class="rounded-md border border-border px-3 py-1.5 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              &larr; Surah Sebelumnya
            </NuxtLink>
            <NuxtLink
              v-if="chapterId < 114"
              :to="`/surah/${chapterId + 1}`"
              class="rounded-md border border-border px-3 py-1.5 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Surah Berikutnya &rarr;
            </NuxtLink>
          </div>
        </div>
      </header>

      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mode Membaca</span>
        <div class="inline-flex rounded-lg border border-border bg-muted/40 p-1">
          <button
            type="button"
            v-for="mode in modes"
            :key="mode.id"
            @click="settings.setReadingMode(mode.id as any)"
            :class="[
              settings.readingMode === mode.id
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            ]"
            class="rounded-md px-3 py-1.5 text-xs transition-all"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>

      <div
        v-if="chapterData.chapter.bismillah_pre && settings.readingMode !== 'mushaf' && settings.readingMode !== 'zen'"
        class="py-4 text-center"
      >
        <p class="quran-arabic text-2xl sm:text-3xl text-foreground" dir="rtl">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>

      <section v-if="settings.readingMode === 'verse'" class="space-y-5">
        <QuranVerseItem
          v-for="verse in versesData?.verses"
          :key="verse.id"
          :verse="verse"
          :surah-name="chapterData.chapter.name_simple"
          :chapter-id="chapterData.chapter.id"
          @open-tafsir="handleOpenTafsir"
          @inspect-word="handleInspectWord"
        />
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
const chapterId = computed(() => Number(route.params.id) || 1);

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
  () => quranApi.getChapter(chapterId.value)
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

onUnmounted(() => {
  audioPlayer.closePlayer();
});
</script>
