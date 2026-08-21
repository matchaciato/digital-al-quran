<template>
  <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
    <header class="space-y-2 border-b border-border/60 pb-6">
      <span class="text-xs font-semibold uppercase tracking-wider text-primary">
        Thematic Quran Knowledge Graph
      </span>
      <h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Pohon Tematik & Kajian Topik Al-Qur'an
      </h1>
      <p class="text-sm text-muted-foreground max-w-3xl">
        Jelajahi keindahan dan hikmah ayat-ayat Al-Qur'an yang saling terhubung lintas surah berdasarkan tema-tema esensial kehidupan.
      </p>
    </header>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="topic in THEMATIC_TOPICS"
        :key="topic.slug"
        :to="`/topics/${topic.slug}`"
        class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {{ topic.category }}
            </span>
            <span class="quran-arabic text-lg text-foreground/80 font-normal" dir="rtl">
              {{ topic.arabicTitle }}
            </span>
          </div>

          <div class="space-y-2">
            <h2 class="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {{ topic.title }}
            </h2>
            <p class="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {{ topic.summary }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between border-t border-border/40 pt-4 text-xs font-medium">
          <span class="text-muted-foreground">{{ topic.verses.length }} Ayat Terpilih</span>
          <span class="text-primary group-hover:underline flex items-center gap-1">
            Pelajari Topik &rarr;
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { THEMATIC_TOPICS } from '~/constants/topics';
</script>
