<template>
  <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <section class="mb-8 space-y-4 text-center sm:text-left">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Al-Qur'an Al-Karim
          </h1>
          <p class="mt-1.5 text-sm text-muted-foreground">
            Baca, pelajari, dan tadabburi firman Allah SWT dengan kenyamanan tipografi modern.
          </p>
        </div>

        <p class="quran-arabic hidden text-2xl text-primary/80 lg:block" dir="rtl">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>

      <div
        v-if="bookmarkStore.lastRead"
        class="flex flex-col items-start justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:p-5"
      >
        <div class="space-y-0.5 text-left">
          <span class="text-xs font-semibold uppercase tracking-wider text-primary">Terakhir Dibaca</span>
          <h2 class="text-lg font-bold text-foreground">
            {{ bookmarkStore.lastRead.surahName }}
            <span class="text-sm font-normal text-muted-foreground">(Ayat {{ bookmarkStore.lastRead.verseKey }})</span>
          </h2>
        </div>
        <NuxtLink
          :to="`/surah/${bookmarkStore.lastRead.chapterId}#verse-${bookmarkStore.lastRead.verseKey}`"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:scale-95"
        >
          Lanjutkan Membaca &rarr;
        </NuxtLink>
      </div>

      <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative w-full sm:max-w-md">
          <input
            type="search"
            v-model="searchQuery"
            placeholder="Cari surah (misal: Al-Kahf, Yasin, 18, Sapi)..."
            class="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div class="inline-flex rounded-lg border border-border bg-muted/50 p-1">
          <button
            type="button"
            @click="activeTab = 'surah'"
            :class="[
              activeTab === 'surah'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            ]"
            class="rounded-md px-4 py-1.5 text-xs transition-all"
          >
            Daftar Surah (114)
          </button>
          <button
            type="button"
            @click="activeTab = 'juz'"
            :class="[
              activeTab === 'juz'
                ? 'bg-card text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            ]"
            class="rounded-md px-4 py-1.5 text-xs transition-all"
          >
            Daftar Juz (30)
          </button>
        </div>
      </div>
    </section>

    <div v-if="pending" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="i in 12"
        :key="i"
        class="h-28 animate-pulse rounded-xl border border-border/50 bg-muted/30 p-5"
      />
    </div>

    <div
      v-else-if="error"
      class="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center"
    >
      <p class="text-sm font-medium text-destructive">Gagal memuat daftar surah.</p>
      <button
        type="button"
        @click="refresh()"
        class="mt-3 rounded-md bg-muted px-4 py-1.5 text-xs font-medium text-foreground hover:bg-border"
      >
        Coba Lagi
      </button>
    </div>

    <section v-else-if="activeTab === 'surah'">
      <div v-if="filteredChapters.length === 0" class="py-16 text-center">
        <p class="text-sm text-muted-foreground">Tidak ada surah yang cocok dengan pencarian "{{ searchQuery }}".</p>
      </div>

      <ul v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="surah in filteredChapters"
          :key="surah.id"
          class="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 transition-all duration-150 hover:border-primary/50 hover:shadow-sm"
        >
          <NuxtLink :to="`/surah/${surah.id}`" class="block">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/40 text-xs font-bold text-foreground group-hover:border-primary/40 group-hover:text-primary"
                >
                  {{ surah.id }}
                </span>
                <div>
                  <h3 class="font-semibold text-foreground transition-colors group-hover:text-primary">
                    {{ surah.name_simple }}
                  </h3>
                  <p class="text-xs text-muted-foreground">
                    {{ surah.translated_name.name }}
                  </p>
                </div>
              </div>

              <span class="quran-arabic text-2xl font-normal text-foreground group-hover:text-primary transition-colors" dir="rtl">
                {{ surah.name_arabic }}
              </span>
            </div>

            <div class="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
              <span class="capitalize">
                {{ surah.revelation_place === 'makkah' ? 'Makkiyah' : 'Madaniyah' }}
              </span>
              <span>{{ surah.verses_count }} Ayat</span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <section v-else-if="activeTab === 'juz'">
      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="juzId in 30"
          :key="juzId"
          class="group rounded-xl border border-border/70 bg-card p-5 transition-all duration-150 hover:border-primary/50 hover:shadow-sm"
        >
          <NuxtLink :to="`/juz/${juzId}`" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/40 text-xs font-bold text-foreground group-hover:border-primary/40 group-hover:text-primary"
              >
                {{ juzId }}
              </span>
              <div>
                <h3 class="font-semibold text-foreground transition-colors group-hover:text-primary">
                  Juz {{ juzId }}
                </h3>
                <p class="text-xs text-muted-foreground">
                  Al-Qur'an Bagian ke-{{ juzId }}
                </p>
              </div>
            </div>

            <span class="text-xs font-medium text-muted-foreground group-hover:text-primary">
              Buka &rarr;
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useQuranApi } from '~/composables/useQuranApi';
import { useBookmarkStore } from '~/stores/useBookmarkStore';
import type { Chapter } from '~/types/quran';

const quranApi = useQuranApi();
const bookmarkStore = useBookmarkStore();

const searchQuery = ref('');
const activeTab = ref<'surah' | 'juz'>('surah');

const { data, pending, error, refresh } = await useAsyncData<{ chapters: Chapter[] }>(
  'chapters-list',
  () => quranApi.getChapters()
);

const filteredChapters = computed(() => {
  if (!data.value?.chapters) return [];
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return data.value.chapters;

  return data.value.chapters.filter((c) => {
    return (
      c.name_simple.toLowerCase().includes(query) ||
      c.translated_name.name.toLowerCase().includes(query) ||
      c.name_arabic.includes(query) ||
      c.id.toString() === query
    );
  });
});

useSeoMeta({
  title: 'Digital Al-Qur\'an — Editorial Typography & Linguistic Anatomy',
  description: 'Platform Al-Qur\'an Digital modern berkelas dunia dengan tipografi editorial presisi, 4 mode membaca, anatomi morfologi kata, dan audio studio tilawah.',
  ogTitle: 'Digital Al-Qur\'an — Editorial Typography & Linguistic Anatomy',
  ogDescription: 'Baca 114 Surah dan 30 Juz Al-Qur\'an dengan kenyamanan tipografi editorial, 4 mode membaca, anatomi akar kata, dan audio murottal.',
  ogType: 'website',
  twitterCard: 'summary_large_image'
});
</script>
