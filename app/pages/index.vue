<template>
  <section>
    <h2>Al-Quran Digital</h2>

    <div v-if="bookmarkStore.lastRead">
      <p>Terakhir Dibaca: {{ bookmarkStore.lastRead.surahName }} (Ayat {{ bookmarkStore.lastRead.verseKey }})</p>
      <NuxtLink :to="`/surah/${bookmarkStore.lastRead.chapterId}#verse-${bookmarkStore.lastRead.verseKey}`">
        Lanjutkan Membaca
      </NuxtLink>
    </div>

    <div>
      <input
        type="search"
        v-model="searchQuery"
        placeholder="Cari surah berdasarkan nama atau nomor..."
      />
    </div>

    <nav>
      <button type="button" :disabled="activeTab === 'surah'" @click="activeTab = 'surah'">Daftar Surah</button>
      <button type="button" :disabled="activeTab === 'juz'" @click="activeTab = 'juz'">Daftar Juz</button>
    </nav>

    <div v-if="pending">
      <p>Memuat daftar surah...</p>
    </div>

    <div v-else-if="error">
      <p>Gagal memuat daftar surah.</p>
    </div>

    <section v-else-if="activeTab === 'surah'">
      <ul>
        <li v-for="surah in filteredChapters" :key="surah.id">
          <NuxtLink :to="`/surah/${surah.id}`">
            <span>{{ surah.id }}.</span>
            <strong>{{ surah.name_simple }}</strong>
            <span>({{ surah.name_arabic }})</span>
            <p>{{ surah.translated_name.name }} • {{ surah.revelation_place }} • {{ surah.verses_count }} Ayat</p>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section v-else-if="activeTab === 'juz'">
      <ul>
        <li v-for="juzId in 30" :key="juzId">
          <NuxtLink :to="`/juz/${juzId}`">
            <strong>Juz {{ juzId }}</strong>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useQuranApi } from '~/composables/useQuranApi';
import { useBookmarkStore } from '~/stores/useBookmarkStore';
import type { Chapter } from '~/types/quran';

const quranApi = useQuranApi();
const bookmarkStore = useBookmarkStore();

const searchQuery = ref('');
const activeTab = ref<'surah' | 'juz'>('surah');

const { data, pending, error } = await useAsyncData<{ chapters: Chapter[] }>('chapters-list', () => {
  return quranApi.getChapters();
});

const filteredChapters = computed(() => {
  if (!data.value?.chapters) return [];
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return data.value.chapters;

  return data.value.chapters.filter((c) => {
    return (
      c.name_simple.toLowerCase().includes(query) ||
      c.translated_name.name.toLowerCase().includes(query) ||
      c.id.toString() === query
    );
  });
});
</script>
