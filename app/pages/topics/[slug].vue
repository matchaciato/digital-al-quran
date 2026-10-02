<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
    <nav class="flex items-center gap-2 text-xs text-muted-foreground">
      <NuxtLink to="/topics" class="hover:text-foreground">&larr; Kembali ke Daftar Topik</NuxtLink>
      <span>/</span>
      <span class="text-foreground font-medium">{{ topic?.title }}</span>
    </nav>

    <div v-if="!topic" class="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
      <p class="text-sm font-medium text-destructive">Topik tidak ditemukan.</p>
      <NuxtLink to="/topics" class="mt-3 inline-block rounded bg-muted px-4 py-2 text-xs font-medium text-foreground">
        Lihat Semua Topik
      </NuxtLink>
    </div>

    <header v-else class="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 shadow-xs">
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div class="space-y-1.5">
          <span class="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {{ topic.category }}
          </span>
          <h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {{ topic.title }}
          </h1>
          <p class="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            {{ topic.summary }}
          </p>
        </div>

        <div class="text-right">
          <span class="quran-arabic text-3xl sm:text-4xl font-normal text-foreground" dir="rtl">
            {{ topic.arabicTitle }}
          </span>
        </div>
      </div>
    </header>

    <section v-if="topic" class="space-y-6">
      <article
        v-for="(verse, idx) in topic.verses"
        :key="verse.verseKey"
        class="rounded-xl border p-6 sm:p-7 space-y-5 transition-all"
        :class="[
          isPlayingVerse(verse.verseKey)
            ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30'
            : 'border-border/70 bg-card hover:border-border'
        ]"
      >
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="rounded bg-primary/10 px-2 py-0.5 font-bold text-primary">
              #{{ idx + 1 }}
            </span>
            <span class="font-semibold text-foreground">
              QS. {{ verse.surahName }} ({{ verse.verseKey }})
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="handlePlayVerse(verse)"
              class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors active:scale-95"
              :class="[
                isPlayingVerse(verse.verseKey)
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
              ]"
              :title="isPlayingVerse(verse.verseKey) ? 'Jeda tilawah' : 'Dengarkan tilawah ayat ini'"
            >
              <span>{{ isPlayingVerse(verse.verseKey) ? '⏸ Jeda' : '▶ Putar' }}</span>
            </button>

            <button
              type="button"
              @click="handleCopyVerse(verse)"
              class="rounded-md border border-border px-2.5 py-1 text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-xs transition-colors active:scale-95"
              title="Salin Ayat & Terjemahan"
            >
              {{ copiedVerseKey === verse.verseKey ? '✓ Tersalin' : '📋 Salin' }}
            </button>

            <NuxtLink
              :to="`/surah/${verse.surahId}#verse-${verse.verseKey}`"
              class="rounded-md border border-border px-2.5 py-1 text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-xs"
            >
              Buka di Surah &rarr;
            </NuxtLink>
          </div>
        </div>

        <p class="quran-arabic text-right text-2xl sm:text-3xl text-foreground leading-[2.4]" dir="rtl">
          {{ verse.arabicText }}
        </p>

        <div class="space-y-1 border-t border-border/40 pt-4">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Terjemahan</span>
          <p class="text-sm text-foreground/90 leading-relaxed">
            {{ verse.translationText }}
          </p>
        </div>

        <div v-if="verse.contextNote" class="rounded-lg border border-primary/20 bg-primary/5 p-3.5 text-xs text-foreground/90 space-y-1">
          <span class="font-bold text-primary text-[11px] uppercase tracking-wider">Tadabbur & Konteks:</span>
          <p>{{ verse.contextNote }}</p>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { THEMATIC_TOPICS, type ThematicTopicVerse } from '~/constants/topics';
import { useAudioStore } from '~/stores/useAudioStore';
import { useAudioPlayer } from '~/composables/useAudioPlayer';

const route = useRoute();
const currentSlug = String(route.params.slug || '');
const currentTopic = THEMATIC_TOPICS.find(t => t.slug === currentSlug);

// Fail-fast route validation (Defensive Programming)
if (!currentTopic) {
  throw createError({
    statusCode: 404,
    statusMessage: `Topik kajian "${currentSlug}" tidak ditemukan.`,
    fatal: true
  });
}

const topic = computed(() => currentTopic);

const audioStore = useAudioStore();
const audioPlayer = useAudioPlayer();

const copiedVerseKey = ref<string | null>(null);

const isPlayingVerse = (verseKey: string): boolean => {
  return audioStore.currentVerseKey === verseKey && audioStore.isPlaying;
};

const handlePlayVerse = (verse: ThematicTopicVerse) => {
  if (isPlayingVerse(verse.verseKey)) {
    audioPlayer.togglePlayPause();
  } else {
    audioPlayer.playVerse(undefined, verse.verseKey);
  }
};

const handleCopyVerse = async (verse: ThematicTopicVerse) => {
  if (!import.meta.client) return;
  const text = `${verse.arabicText}\n\n"${verse.translationText}"\n(QS. ${verse.surahName}: ${verse.verseKey})`;
  try {
    await navigator.clipboard.writeText(text);
    copiedVerseKey.value = verse.verseKey;
    setTimeout(() => {
      if (copiedVerseKey.value === verse.verseKey) {
        copiedVerseKey.value = null;
      }
    }, 2000);
  } catch (err) {
    console.error('Gagal menyalin ayat tematik:', err);
  }
};
</script>
