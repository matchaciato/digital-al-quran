<template>
  <section>
    <h2>Pencarian Teks Al-Quran</h2>

    <form @submit.prevent="handleSearch">
      <input
        type="search"
        v-model="queryInput"
        placeholder="Ketik kata kunci pencarian (misal: sabar, shalat, dll)..."
      />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Mencari...' : 'Cari' }}
      </button>
    </form>

    <div v-if="error">
      <p>{{ error }}</p>
    </div>

    <section v-if="results">
      <h3>Hasil Pencarian untuk: "{{ currentQuery }}"</h3>
      <p>Total Ditemukan: {{ results.search.total_results }} Ayat</p>

      <div v-if="results.search.results.length === 0">
        <p>Tidak ada hasil yang cocok dengan kata kunci tersebut.</p>
      </div>

      <ul v-else>
        <li v-for="item in results.search.results" :key="item.verse_id">
          <header>
            <strong>Ayat {{ item.verse_key }}</strong>
            <NuxtLink :to="`/surah/${item.verse_key.split(':')[0]}#verse-${item.verse_key}`">
              Buka Ayat
            </NuxtLink>
          </header>
          <div v-html="item.text"></div>
          <div v-if="item.translations && item.translations.length > 0">
            <p v-html="item.translations[0].text"></p>
          </div>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useQuranApi } from '~/composables/useQuranApi';
import type { SearchResponse } from '~/types/quran';

const route = useRoute();
const router = useRouter();

const quranApi = useQuranApi();

const queryInput = ref(String(route.query.q || ''));
const currentQuery = ref(String(route.query.q || ''));
const results = ref<SearchResponse | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const executeSearch = async (query: string) => {
  if (!query.trim()) return;
  isLoading.value = true;
  error.value = null;
  currentQuery.value = query;

  try {
    const res = await quranApi.searchQuran(query);
    results.value = res;
  } catch (err: any) {
    error.value = 'Gagal melakukan pencarian.';
  } finally {
    isLoading.value = false;
  }
};

if (currentQuery.value) {
  executeSearch(currentQuery.value);
}

const handleSearch = () => {
  if (!queryInput.value.trim()) return;
  router.push({ query: { q: queryInput.value.trim() } });
  executeSearch(queryInput.value.trim());
};
</script>
