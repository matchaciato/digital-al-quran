<template>
  <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div v-if="pending" class="space-y-6">
      <div class="h-32 animate-pulse rounded-2xl border border-border/50 bg-muted/30" />
      <div v-for="i in 5" :key="i" class="h-32 animate-pulse rounded-xl border border-border/50 bg-muted/20" />
    </div>

    <div
      v-else-if="error || !data?.verses"
      class="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center"
    >
      <p class="text-sm font-medium text-destructive">Gagal memuat data Juz {{ juzId }}.</p>
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
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div class="space-y-1">
            <span class="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              Al-Qur'an Bagian
            </span>
            <h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Juz {{ juzId }}
            </h1>
            <p class="text-xs text-muted-foreground">
              Total {{ data.verses.length }} Ayat dalam Juz ini
            </p>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <NuxtLink
              v-if="juzId > 1"
              :to="`/juz/${juzId - 1}`"
              class="rounded-md border border-border px-3 py-1.5 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              &larr; Juz {{ juzId - 1 }}
            </NuxtLink>
            <NuxtLink
              v-if="juzId < 30"
              :to="`/juz/${juzId + 1}`"
              class="rounded-md border border-border px-3 py-1.5 font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Juz {{ juzId + 1 }} &rarr;
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

      <section v-if="settings.readingMode === 'verse'" class="space-y-5">
        <QuranVerseItem
          v-for="verse in data.verses"
          :key="verse.id"
          :verse="verse"
          :surah-name="`Juz ${juzId}`"
          :chapter-id="Number(verse.verse_key.split(':')[0])"
          @open-tafsir="handleOpenTafsir"
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
  </div>
</template>

<script setup lang="ts">
import { useQuranApi } from '~/composables/useQuranApi';
import { useSettingsStore } from '~/stores/useSettingsStore';

const route = useRoute();
const juzId = computed(() => Number(route.params.id) || 1);

const quranApi = useQuranApi();
const settings = useSettingsStore();

const isTafsirOpen = ref(false);
const selectedTafsirVerseKey = ref('');

const modes = [
  { id: 'verse', label: 'Ayat' },
  { id: 'mushaf', label: 'Mushaf' },
  { id: 'zen', label: 'Zen' },
  { id: 'parallel', label: 'Komparasi' }
];

const { data, pending, error } = await useAsyncData(
  `juz-${juzId.value}-${settings.selectedReciterId}`,
  () => quranApi.getVersesByJuz(juzId.value, {
    reciterId: settings.selectedReciterId,
    perPage: 300
  })
);

const handleOpenTafsir = (verseKey: string) => {
  selectedTafsirVerseKey.value = verseKey;
  isTafsirOpen.value = true;
};
</script>
