<template>
  <div class="page-container space-y-8">
    <header class="border-b border-border pb-6">
      <p class="eyebrow">
        Kajian Tematik Al-Qur'an
      </p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Pohon Tematik & Kajian Topik
      </h1>
      <p class="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
        Jelajahi ayat-ayat Al-Qur'an yang saling terhubung lintas surah berdasarkan tema-tema esensial kehidupan.
      </p>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="topic in THEMATIC_TOPICS"
        :key="topic.slug"
        :to="`/topics/${topic.slug}`"
        class="group flex flex-col justify-between rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/40"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
              {{ topic.category }}
            </span>
            <span class="quran-arabic text-xl font-normal text-muted-foreground" lang="ar" dir="rtl">
              {{ topic.arabicTitle }}
            </span>
          </div>

          <div class="space-y-1.5">
            <h2 class="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {{ topic.title }}
            </h2>
            <p class="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {{ topic.summary }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between border-t border-border/40 pt-4 text-xs font-medium">
          <span class="text-muted-foreground">{{ topic.verses.length }} ayat pilihan</span>
          <span class="text-primary group-hover:underline">
            Pelajari topik &rarr;
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { THEMATIC_TOPICS } from '~/constants/topics';

useSeoMeta({
  title: 'Pohon Tematik & Kajian Topik Al-Qur\'an — Al-Qur\'an Digital',
  description: 'Jelajahi ayat-ayat Al-Qur\'an berdasarkan tema esensial: ketenangan hati, sabar dan syukur, kepemimpinan, sains & alam semesta, hingga kisah para nabi.',
  ogTitle: 'Pohon Tematik & Kajian Topik Al-Qur\'an',
  ogDescription: 'Koleksi tematik ayat-ayat Al-Qur\'an lintas surah dengan transliterasi, terjemahan, dan audio tilawah.',
  ogType: 'website',
  twitterCard: 'summary_large_image'
});
</script>
