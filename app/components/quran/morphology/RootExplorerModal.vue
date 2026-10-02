<template>
  <Teleport to="body">
    <div
      v-if="isOpen && wordData"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs transition-opacity"
      @click.self="closeModal"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="root-modal-title"
        class="flex max-h-[90vh] w-full max-w-2xl flex-col justify-between overflow-hidden rounded-2xl border border-border bg-background shadow-2xl transition-all"
      >
        <header class="flex items-center justify-between border-b border-border p-5">
          <div class="space-y-0.5">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Linguistic Anatomy & Root Explorer
            </span>
            <h2 id="root-modal-title" class="text-lg font-bold text-foreground">
              Anatomi Morfologi Kata: "{{ wordData.arabic }}"
            </h2>
          </div>

          <button
            type="button"
            @click="closeModal"
            class="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Tutup modal"
          >
            <X class="h-4 w-4" />
          </button>
        </header>

        <div class="overflow-y-auto p-6 space-y-6">
          <div class="flex flex-col items-center justify-between gap-4 rounded-xl border border-border/80 bg-card p-6 text-center sm:flex-row sm:text-left">
            <div class="space-y-1">
              <span class="text-xs text-muted-foreground">Posisi: Ayat {{ wordData.location }}</span>
              <h3 class="text-lg font-bold text-foreground">{{ wordData.translation }}</h3>
              <p class="text-xs font-mono text-muted-foreground">{{ wordData.transliteration }}</p>
            </div>

            <div class="flex items-center gap-4">
              <button
                type="button"
                @click="morphology.playWordAudio(rawWord?.audio_url || null)"
                class="rounded-full border border-border bg-muted/60 p-2.5 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                title="Putar audio kata"
              >
                <Volume2 class="h-5 w-5" />
              </button>
              <span class="quran-arabic text-4xl text-primary font-bold" dir="rtl">
                {{ wordData.arabic }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="rounded-lg border border-border/60 bg-muted/30 p-3.5 text-center space-y-1">
              <span class="text-[10px] font-semibold uppercase text-muted-foreground">Akar Kata (Root)</span>
              <p class="quran-arabic text-xl font-bold text-primary" dir="rtl">
                {{ wordData.rootArabic }}
              </p>
              <span class="text-[11px] font-mono text-muted-foreground">[{{ wordData.root }}]</span>
            </div>

            <div class="rounded-lg border border-border/60 bg-muted/30 p-3.5 text-center space-y-1">
              <span class="text-[10px] font-semibold uppercase text-muted-foreground">Tata Bahasa</span>
              <p class="text-xs font-bold text-foreground line-clamp-1">
                {{ wordData.partOfSpeechLabel }}
              </p>
              <span class="text-[10px] text-muted-foreground capitalize">
                {{ wordData.partOfSpeech }}
              </span>
            </div>

            <div class="rounded-lg border border-border/60 bg-muted/30 p-3.5 text-center space-y-1">
              <span class="text-[10px] font-semibold uppercase text-muted-foreground">Pola Wazan</span>
              <p class="quran-arabic text-sm font-bold text-foreground" dir="rtl">
                {{ wordData.wazan || 'فَعَلَ' }}
              </p>
              <span class="text-[10px] text-muted-foreground">Bentuk Dasar</span>
            </div>

            <div class="rounded-lg border border-border/60 bg-muted/30 p-3.5 text-center space-y-1">
              <span class="text-[10px] font-semibold uppercase text-muted-foreground">Frekuensi</span>
              <p class="text-base font-bold text-primary">
                {{ wordData.occurrencesCount }}x
              </p>
              <span class="text-[10px] text-muted-foreground">Di Seluruh Al-Qur'an</span>
            </div>
          </div>

          <div class="space-y-3 pt-2">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Konkordansi Al-Qur'an (Ayat Terkait Akar "{{ wordData.root }}")
              </h4>
              <span class="text-xs text-muted-foreground">{{ wordData.relatedAyahs.length }} Contoh Ayat</span>
            </div>

            <div class="space-y-2.5">
              <div
                v-for="ayah in wordData.relatedAyahs"
                :key="ayah.verseKey"
                class="rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-primary/40 space-y-2"
              >
                <div class="flex items-center justify-between text-xs">
                  <span class="rounded bg-muted px-2 py-0.5 font-bold text-foreground">
                    QS. {{ ayah.surahName }} ({{ ayah.verseKey }})
                  </span>
                  <NuxtLink
                    :to="`/surah/${ayah.surahId}#verse-${ayah.verseKey}`"
                    @click="closeModal"
                    class="font-medium text-primary hover:underline"
                  >
                    Buka Ayat &rarr;
                  </NuxtLink>
                </div>

                <p class="quran-arabic text-right text-base text-foreground leading-[2.2]" dir="rtl">
                  {{ ayah.text }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ ayah.translation }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer class="border-t border-border p-4 bg-muted/20 flex justify-end">
          <button
            type="button"
            @click="closeModal"
            class="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-95"
          >
            Tutup
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Volume2 } from '@lucide/vue';
import { useEventListener } from '@vueuse/core';
import { useMorphology } from '~/composables/useMorphology';
import type { Word } from '~/types/quran';
import type { WordMorphology } from '~/types/morphology';

const props = defineProps<{
  isOpen: boolean;
  rawWord: Word | null;
  verseKey: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const morphology = useMorphology();

const wordData = computed<WordMorphology | null>(() => {
  if (!props.rawWord) return null;
  return morphology.getWordMorphology(props.rawWord, props.verseKey);
});

const closeModal = () => {
  emit('close');
};

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeModal();
  }
});
</script>
