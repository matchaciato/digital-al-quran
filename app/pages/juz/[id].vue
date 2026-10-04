<template>
  <div class="page-container">
    <div v-if="pending" class="space-y-4" role="status" aria-busy="true">
      <span class="sr-only">Memuat data juz</span>
      <div class="h-32 animate-pulse rounded-lg bg-muted" />
      <div v-for="i in 5" :key="i" class="h-32 animate-pulse rounded-lg bg-muted" />
    </div>

    <div
      v-else-if="error || !data?.verses"
      role="alert"
      class="rounded-lg border border-destructive/40 p-8 text-center"
    >
      <p class="font-medium text-destructive">Gagal memuat data Juz {{ juzId }}.</p>
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
          Al-Qur'an &middot; Juz {{ juzId }} dari 30 &middot; {{ data.verses.length }} ayat
        </p>

        <div class="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
              Juz {{ juzId }}
            </h1>
            <p class="mt-1 text-sm text-muted-foreground">
              Menampilkan seluruh ayat yang terangkum dalam bagian Juz {{ juzId }}.
            </p>
          </div>

          <nav aria-label="Navigasi juz" class="flex items-center gap-2 text-sm">
            <NuxtLink
              v-if="juzId > 1"
              :to="`/juz/${juzId - 1}`"
              rel="prev"
              class="inline-flex h-10 items-center rounded-md border border-input px-3 font-medium hover:bg-muted"
            >
              Juz sebelumnya
            </NuxtLink>
            <NuxtLink
              v-if="juzId < 30"
              :to="`/juz/${juzId + 1}`"
              rel="next"
              class="inline-flex h-10 items-center rounded-md border border-input px-3 font-medium hover:bg-muted"
            >
              Juz berikutnya
            </NuxtLink>
          </nav>
        </div>
      </header>

      <QuranReaderReadingModeSwitch />

      <section v-if="settings.readingMode === 'verse'" class="space-y-5">
        <QuranVerseItem
          v-for="verse in data.verses"
          :key="verse.id"
          :verse="verse"
          :surah-name="getSurahName(verse.verse_key, `Juz ${juzId}`)"
          :chapter-id="Number(verse.verse_key.split(':')[0])"
          @open-tafsir="handleOpenTafsir"
          @inspect-word="handleInspectWord"
        />
      </section>

      <section v-else-if="settings.readingMode === 'mushaf'">
        <QuranReaderMushafPageView
          :verses="data.verses"
          :surah-name="`Juz ${juzId}`"
          @open-tafsir="handleOpenTafsir"
        />
      </section>

      <section v-else-if="settings.readingMode === 'zen'">
        <QuranReaderZenReaderView
          :verses="data.verses"
          :surah-name="`Juz ${juzId}`"
          @exit="settings.setReadingMode('verse')"
        />
      </section>

      <section v-else-if="settings.readingMode === 'parallel'">
        <QuranReaderParallelView
          :verses="data.verses"
          :surah-name="`Juz ${juzId}`"
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
import { getSurahName } from '~/constants/surahs';
import type { Word } from '~/types/quran';

const route = useRoute();
const rawJuzId = Number(route.params.id);

// Fail-fast boundary validation (Defensive Programming)
if (isNaN(rawJuzId) || rawJuzId < 1 || rawJuzId > 30) {
  throw createError({
    statusCode: 404,
    statusMessage: `Juz ${route.params.id} tidak ditemukan. Al-Qur'an terdiri dari Juz 1 hingga 30.`,
    fatal: true
  });
}

const juzId = computed(() => rawJuzId);

const quranApi = useQuranApi();
const settings = useSettingsStore();
const audioStore = useAudioStore();
const audioPlayer = useAudioPlayer();

const isTafsirOpen = ref(false);
const selectedTafsirVerseKey = ref('');

const isRootExplorerOpen = ref(false);
const selectedWord = ref<Word | null>(null);
const selectedWordVerseKey = ref('');


const { data, pending, error } = await useAsyncData(
  () => `juz-${juzId.value}-${settings.selectedReciterId}`,
  () => quranApi.getVersesByJuz(juzId.value, {
    reciterId: settings.selectedReciterId,
    perPage: 300
  }),
  {
    watch: [() => settings.selectedReciterId]
  }
);

watch(() => data.value?.verses, (newVerses) => {
  if (newVerses && newVerses.length > 0) {
    audioStore.setVersesList(newVerses);
  }
}, { immediate: true });

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
  title: () => `Al-Qur'an Juz ${juzId.value} — Teks Arab, Terjemahan & Audio`,
  description: () => `Baca ayat-ayat Al-Qur'an dalam Juz ${juzId.value}. Tersedia 4 mode membaca (Ayat, Mushaf Madinah, Zen, dan Komparasi Terjemahan) serta audio tilawah.`,
  ogTitle: () => `Al-Qur'an Juz ${juzId.value}`,
  ogDescription: () => `Baca Al-Qur'an Juz ${juzId.value} dengan tipografi editorial modern dan terjemahan lengkap.`,
  ogType: 'article',
  twitterCard: 'summary_large_image'
});
</script>
