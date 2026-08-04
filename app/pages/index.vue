<template>
  <section class="w-full max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
    <h2>Al-Quran Digital</h2>

    <div v-if="bookmarkStore.lastRead">
      <p>
        Terakhir Dibaca: {{ bookmarkStore.lastRead.surahName }} (Ayat
        {{ bookmarkStore.lastRead.verseKey }})
      </p>
      <NuxtLink
        :to="`/surah/${bookmarkStore.lastRead.chapterId}#verse-${bookmarkStore.lastRead.verseKey}`"
      >
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
      <button
        type="button"
        :disabled="activeTab === 'surah'"
        @click="activeTab = 'surah'"
      >
        Daftar Surah
      </button>
      <button
        type="button"
        :disabled="activeTab === 'juz'"
        @click="activeTab = 'juz'"
      >
        Daftar Juz
      </button>
    </nav>

    <div v-if="pending">
      <p>Memuat daftar surah...</p>
    </div>

    <div v-else-if="error">
      <p>Gagal memuat daftar surah.</p>
    </div>

    <section v-else-if="activeTab === 'surah'">
      <ul class="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="surah in filteredChapters"
          :key="surah.id"
          :tabindex="surah.id"
          class="group p-6 rounded-xl border border-border hover:border-emerald-400 shadow-sm"
        >
          <NuxtLink :to="`/surah/${surah.id}`">
            <div class="flex justify-between">
              <div class="flex flex-col">
                <h3 class="text-xl font-semibold">{{ surah.name_simple }}</h3>
                <p class="text-sm text-muted-foreground">
                  {{ surah.translated_name.name }}
                </p>
              </div>
              <p class="text-emerald-500 text-xs">{{ surah.id }}</p>
            </div>
            <p class="text-4xl font-serif text-end my-5">
              {{ surah.name_arabic }}
            </p>
            <div class="flex items-center gap-x-2 text-sm text-muted-foreground">
              <p class="capitalize">{{ surah.revelation_place }}</p>
              <span class="text-xs">&bull;</span>
              <p>{{ surah.verses_count }} Ayat</p>
            </div>
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
import { useQuranApi } from "~/composables/useQuranApi";
import { useBookmarkStore } from "~/stores/useBookmarkStore";
import type { Chapter } from "~/types/quran";

const quranApi = useQuranApi();
const bookmarkStore = useBookmarkStore();

const searchQuery = ref("");
const activeTab = ref<"surah" | "juz">("surah");

const { data, pending, error } = await useAsyncData<{ chapters: Chapter[] }>(
  "chapters-list",
  () => {
    return quranApi.getChapters();
  },
);

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
