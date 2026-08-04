<template>
  <section v-if="pending">
    <p>Memuat data Juz {{ juzId }}...</p>
  </section>

  <section v-else-if="error || !data?.verses">
    <p>Gagal memuat data Juz {{ juzId }}.</p>
    <NuxtLink to="/">Kembali ke Beranda</NuxtLink>
  </section>

  <article v-else>
    <header>
      <h2>Juz {{ juzId }}</h2>
      <p>Jumlah Ayat: {{ data.verses.length }}</p>
    </header>

    <section>
      <QuranVerseItem
        v-for="verse in data.verses"
        :key="verse.id"
        :verse="verse"
        :surah-name="`Juz ${juzId}`"
        :chapter-id="Number(verse.verse_key.split(':')[0])"
        @open-tafsir="handleOpenTafsir"
      />
    </section>

    <QuranTafsirModal
      :is-open="isTafsirOpen"
      :verse-key="selectedTafsirVerseKey"
      @close="isTafsirOpen = false"
    />
  </article>
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
