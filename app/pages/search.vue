<template>
  <div class="page-container max-w-4xl space-y-8">
    <!-- Hero Search Section -->
    <header class="text-center">
      <p class="eyebrow">
        Eksplorasi Kata Kunci Al-Qur'an
      </p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Pencarian Teks Al-Qur'an
      </h1>
      <p class="mt-2 max-w-xl mx-auto text-sm text-muted-foreground sm:text-base leading-relaxed">
        Cari ayat, kata kunci, terjemahan, dan tematik lintas 114 surah dengan cepat dan akurat.
      </p>

      <!-- Search Box Form -->
      <form @submit.prevent="handleSearch" class="mt-6 flex max-w-2xl mx-auto gap-2" role="search">
        <div class="relative flex-1">
          <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            v-model="queryInput"
            aria-label="Cari kata kunci Al-Qur'an"
            placeholder="Cari kata kunci (contoh: sabar, surga, shalat, taqwa)..."
            class="w-full rounded-md border border-input bg-card pl-10 pr-10 py-2.5 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <button
            v-if="queryInput"
            type="button"
            @click="queryInput = ''"
            aria-label="Hapus kata kunci pencarian"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <X class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <button
          type="submit"
          :disabled="isLoading || !queryInput.trim()"
          class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin mr-1.5" aria-hidden="true" />
          <span v-else>Cari</span>
        </button>
      </form>

      <!-- Popular Tags / Chips -->
      <div class="mt-4 flex flex-wrap items-center justify-center gap-1.5">
        <span class="text-xs text-muted-foreground">Populer:</span>
        <button
          v-for="tag in popularKeywords"
          :key="tag"
          type="button"
          @click="selectKeyword(tag)"
          class="rounded-md border border-input bg-card px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {{ tag }}
        </button>
      </div>
    </header>

    <!-- Error Alert -->
    <div v-if="error" class="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      {{ error }}
    </div>

    <!-- Results Section -->
    <section v-if="results">
      <!-- Result Stats Header -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <h2 class="text-lg font-bold text-foreground">
            Hasil Pencarian
          </h2>
          <p class="text-xs text-muted-foreground mt-0.5">
            Ditemukan <span class="font-semibold text-foreground">{{ results.search.total_results }}</span> ayat untuk kata kunci
            <span class="inline-block rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">"{{ currentQuery }}"</span>
          </p>
        </div>

        <div v-if="results.search.results.length > 0" class="text-xs text-muted-foreground">
          Menampilkan {{ results.search.results.length }} hasil relevan
        </div>
      </div>

      <!-- Empty State When No Results Found -->
      <div
        v-if="results.search.results.length === 0"
        class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center"
      >
        <BookOpen class="h-12 w-12 text-muted-foreground/40 mb-3" />
        <h3 class="text-base font-semibold text-foreground">Tidak ada ayat yang ditemukan</h3>
        <p class="mt-1 text-xs text-muted-foreground max-w-sm">
          Coba periksa ejaan kata kunci atau gunakan kata dasar yang lebih umum seperti "rahmat", "rezeki", atau "doa".
        </p>
      </div>

      <!-- Results List -->
      <div v-else class="space-y-4">
        <article
          v-for="item in results.search.results"
          :key="item.verse_id"
          class="rounded-lg border border-border bg-card p-5 sm:p-6 transition-colors hover:border-foreground/30"
        >
          <!-- Card Header: Verse Key & Quick Actions -->
          <div class="flex items-center justify-between gap-3 border-b border-border/40 pb-3 mb-4">
            <div class="flex items-center gap-2">
              <span class="inline-flex h-7 items-center rounded-md bg-muted px-2.5 font-mono text-xs font-semibold text-foreground">
                Ayat {{ item.verse_key }}
              </span>
            </div>

            <div class="flex items-center gap-1.5">
              <!-- Play Audio Preview -->
              <button
                type="button"
                @click="handlePlayVerse(item.verse_key)"
                class="inline-flex h-8 items-center gap-1 rounded-md border border-input px-2.5 text-xs font-medium text-foreground hover:bg-muted"
                aria-label="Dengarkan ayat ini"
              >
                <Play class="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                <span>Putar</span>
              </button>

              <!-- Copy Verse Text -->
              <button
                type="button"
                @click="copyVerse(item)"
                class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input text-muted-foreground hover:bg-muted hover:text-foreground"
                :aria-label="copiedKey === item.verse_key ? 'Teks ayat tersalin' : 'Salin teks ayat'"
              >
                <Check v-if="copiedKey === item.verse_key" class="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                <Copy v-else class="h-3.5 w-3.5" aria-hidden="true" />
              </button>

              <!-- Open in Surah Reader Link -->
              <NuxtLink
                :to="`/surah/${item.verse_key.split(':')[0]}#verse-${item.verse_key}`"
                class="inline-flex h-8 items-center gap-1 rounded-md border border-input px-2.5 text-xs font-medium text-foreground hover:bg-muted"
              >
                <span>Buka</span>
                <ExternalLink class="h-3.5 w-3.5" aria-hidden="true" />
              </NuxtLink>
            </div>
          </div>

          <!-- Arabic Text -->
          <div class="mb-4 text-right">
            <div
              class="quran-arabic text-2xl sm:text-3xl leading-[2.4] text-foreground select-text"
              lang="ar"
              dir="rtl"
              v-html="item.text"
            ></div>
          </div>

          <!-- Indonesian Translation with Keyword Highlight -->
          <div v-if="item.translations && item.translations.length > 0" class="border-t border-border/40 pt-3">
            <p
              class="text-sm leading-relaxed text-muted-foreground select-text"
              v-html="highlightKeyword(stripHtmlTags(item.translations[0].text), currentQuery)"
            ></p>
          </div>
        </article>
      </div>
    </section>

    <!-- Initial State (Before Searching) -->
    <div
      v-else-if="!isLoading"
      class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center"
    >
      <Compass class="h-10 w-10 text-muted-foreground/40 mb-3" aria-hidden="true" />
      <h2 class="text-base font-semibold text-foreground">Mulai Pencarian Ayat</h2>
      <p class="mt-1 text-xs text-muted-foreground max-w-sm">
        Ketik kata kunci apa saja atau klik salah satu topik populer di atas untuk menjelajahi kalamullah.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Sparkles, X, Loader2, BookOpen, ExternalLink, Play, Copy, Check, Compass } from '@lucide/vue';
import { useQuranApi } from '~/composables/useQuranApi';
import { useAudioPlayer } from '~/composables/useAudioPlayer';
import { stripHtmlTags } from '~/utils/quranValidation';
import type { SearchResponse } from '~/types/quran';

const route = useRoute();
const router = useRouter();
const quranApi = useQuranApi();
const audioPlayer = useAudioPlayer();

const popularKeywords = [
  'Sabar',
  'Shalat',
  'Rahmat',
  'Taqwa',
  'Rezeki',
  'Surga',
  'Orang Tua',
  'Hati'
];

const queryInput = ref(String(route.query.q || ''));
const currentQuery = ref(String(route.query.q || ''));
const results = ref<SearchResponse | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const copiedKey = ref<string | null>(null);

const executeSearch = async (query: string) => {
  if (!query.trim()) return;
  isLoading.value = true;
  error.value = null;
  currentQuery.value = query;

  try {
    const res = await quranApi.searchQuran(query);
    results.value = res;
  } catch (err: any) {
    error.value = 'Gagal melakukan pencarian. Silakan coba kembali sesaat lagi.';
  } finally {
    isLoading.value = false;
  }
};

const handleSearch = () => {
  if (!queryInput.value.trim()) return;
  router.push({ query: { q: queryInput.value.trim() } });
  executeSearch(queryInput.value.trim());
};

const selectKeyword = (kw: string) => {
  queryInput.value = kw;
  handleSearch();
};

const handlePlayVerse = (verseKey: string) => {
  audioPlayer.playVerse(null, verseKey);
};

const copyVerse = async (item: any) => {
  const trans = item.translations?.[0]?.text ? stripHtmlTags(item.translations[0].text) : '';
  const textToCopy = `"${stripHtmlTags(item.text)}"\n\nArtinya: ${trans} (QS. Ayat ${item.verse_key})`;
  try {
    await navigator.clipboard.writeText(textToCopy);
    copiedKey.value = item.verse_key;
    setTimeout(() => {
      if (copiedKey.value === item.verse_key) {
        copiedKey.value = null;
      }
    }, 2000);
  } catch (e) {
    console.warn('Copy failed:', e);
  }
};

const highlightKeyword = (text: string, query: string): string => {
  if (!query || !query.trim()) return text;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark class="bg-primary/20 text-primary font-semibold px-1 rounded">$1</mark>');
};

if (currentQuery.value) {
  executeSearch(currentQuery.value);
}

useSeoMeta({
  title: () => {
    return currentQuery.value
      ? `Hasil Pencarian "${currentQuery.value}" — Al-Qur'an Digital`
      : 'Pencarian Ayat & Terjemahan — Al-Qur\'an Digital';
  },
  description: () => {
    return currentQuery.value
      ? `Hasil pencarian ayat Al-Qur'an dan terjemahan untuk kata kunci "${currentQuery.value}". Temukan ayat terkait dengan mudah.`
      : 'Cari ayat, kata kunci, terjemahan, dan tafsir Al-Qur\'an secara cepat dan akurat.';
  },
  ogTitle: () => {
    return currentQuery.value
      ? `Pencarian "${currentQuery.value}" — Al-Qur'an Digital`
      : 'Pencarian Al-Qur\'an Digital';
  },
  ogDescription: 'Cari ayat Al-Qur\'an dengan teks Arab, latin, atau terjemahan bahasa Indonesia.',
  ogType: 'website'
});
</script>
