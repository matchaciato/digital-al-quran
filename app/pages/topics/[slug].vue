<template>
  <div class="page-container space-y-8">
    <nav aria-label="Navigasi rekam jejak" class="flex items-center gap-2 text-xs text-muted-foreground">
      <NuxtLink to="/topics" class="hover:text-foreground">Daftar topik</NuxtLink>
      <span aria-hidden="true">&sol;</span>
      <span class="text-foreground font-medium">{{ topic?.title }}</span>
    </nav>

    <div v-if="!topic" role="alert" class="rounded-lg border border-destructive/40 p-8 text-center">
      <p class="font-medium text-destructive">Topik tidak ditemukan.</p>
      <NuxtLink to="/topics" class="mt-4 inline-flex h-10 items-center rounded-md border border-input px-4 text-sm font-medium hover:bg-muted">
        Lihat semua topik
      </NuxtLink>
    </div>

    <header v-else class="border-b border-border pb-6">
      <p class="eyebrow">
        Kajian Tematik &middot; {{ topic.category }} &middot; {{ topic.verses.length }} ayat pilihan
      </p>

      <div class="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
            {{ topic.title }}
          </h1>
          <p class="mt-1.5 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            {{ topic.summary }}
          </p>
        </div>

        <p class="quran-arabic text-3xl sm:text-4xl" lang="ar" dir="rtl">
          {{ topic.arabicTitle }}
        </p>
      </div>
    </header>

    <section v-if="topic" class="space-y-6">
      <article
        v-for="(verse, idx) in topic.verses"
        :key="verse.verseKey"
        class="rounded-lg border border-border bg-card p-5 sm:p-6 space-y-4"
        :class="[
          isPlayingVerse(verse.verseKey)
            ? 'border-primary ring-1 ring-primary/40'
            : 'hover:border-border'
        ]"
      >
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
              QS. {{ verse.surahName }} : {{ verse.verseKey }}
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="handlePlayVerse(verse)"
              class="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors"
              :class="
                isPlayingVerse(verse.verseKey)
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-input text-muted-foreground hover:bg-muted hover:text-foreground'
              "
              :aria-label="isPlayingVerse(verse.verseKey) ? 'Jeda tilawah' : 'Putar tilawah ayat ini'"
            >
              <Pause v-if="isPlayingVerse(verse.verseKey)" class="h-3.5 w-3.5" aria-hidden="true" />
              <Play v-else class="h-3.5 w-3.5" aria-hidden="true" />
              <span>{{ isPlayingVerse(verse.verseKey) ? 'Jeda' : 'Putar' }}</span>
            </button>

            <button
              type="button"
              @click="handleCopyVerse(verse)"
              class="inline-flex h-8 items-center gap-1.5 rounded-md border border-input px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              :aria-label="copiedVerseKey === verse.verseKey ? 'Ayat tersalin' : 'Salin ayat dan terjemahan'"
            >
              <Check v-if="copiedVerseKey === verse.verseKey" class="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <Copy v-else class="h-3.5 w-3.5" aria-hidden="true" />
              <span>{{ copiedVerseKey === verse.verseKey ? 'Tersalin' : 'Salin' }}</span>
            </button>

            <NuxtLink
              :to="`/surah/${verse.surahId}#verse-${verse.verseKey}`"
              class="inline-flex h-8 items-center rounded-md border border-input px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Buka di surah
            </NuxtLink>
          </div>
        </div>

        <p class="quran-arabic text-right text-2xl sm:text-3xl text-foreground leading-[2.4]" dir="rtl">
          {{ verse.arabicText }}
        </p>

        <div class="space-y-1 border-t border-border/40 pt-4">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Terjemahan</span>
          <p class="text-sm text-foreground/90 leading-relaxed">
            {{ verse.translationText }}
          </p>
        </div>

        <div v-if="verse.contextNote" class="rounded-lg border border-primary/20 bg-primary/5 p-3.5 text-xs text-foreground/90 space-y-1">
          <span class="font-bold text-primary text-xs uppercase tracking-wider">Tadabbur & Konteks:</span>
          <p>{{ verse.contextNote }}</p>
        </div>
      </article>
    </section>
  </div>
</template>
<script setup lang="ts">
import { Play, Pause, Copy, Check } from '@lucide/vue';
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

if (currentTopic) {
  useSeoMeta({
    title: `${currentTopic.title} — Kajian Tematik Al-Qur'an`,
    description: `${currentTopic.summary} Menampilkan ${currentTopic.verses.length} ayat pilihan bertema ${currentTopic.category} lengkap dengan terjemahan, audio, dan tadabbur.`,
    ogTitle: `${currentTopic.title} (${currentTopic.arabicTitle})`,
    ogDescription: currentTopic.summary,
    ogType: 'article',
    twitterCard: 'summary_large_image'
  });
}
</script>
