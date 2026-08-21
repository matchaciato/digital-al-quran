<template>
  <Teleport to="body">
    <div
      v-if="isOpen && verse"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      @click.self="$emit('close')"
    >
      <div
        class="flex max-h-[90vh] w-full max-w-lg flex-col justify-between overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
      >
        <header class="flex items-center justify-between border-b border-border p-4 bg-card/50">
          <div class="space-y-0.5">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Generator Kartu Ayat Tipografis
            </span>
            <h2 class="text-sm font-bold text-foreground">
              QS. {{ surahName }} : {{ verse.verse_number }}
            </h2>
          </div>
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X class="h-4 w-4" />
          </button>
        </header>

        <div class="overflow-y-auto p-5 space-y-5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="space-y-1">
              <span class="text-[11px] font-semibold text-muted-foreground">Rasio Gambar</span>
              <div class="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
                <button
                  type="button"
                  @click="ratio = '1:1'"
                  class="rounded px-2.5 py-1 transition-all"
                  :class="ratio === '1:1' ? 'bg-card text-primary font-bold shadow-xs' : 'text-muted-foreground'"
                >
                  Persegi (1:1)
                </button>
                <button
                  type="button"
                  @click="ratio = '9:16'"
                  class="rounded px-2.5 py-1 transition-all"
                  :class="ratio === '9:16' ? 'bg-card text-primary font-bold shadow-xs' : 'text-muted-foreground'"
                >
                  Cerita (9:16)
                </button>
              </div>
            </div>

            <div class="space-y-1">
              <span class="text-[11px] font-semibold text-muted-foreground">Palet Tema</span>
              <div class="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
                <button
                  type="button"
                  @click="theme = 'alabaster'"
                  class="rounded px-2 py-1 transition-all"
                  :class="theme === 'alabaster' ? 'bg-card text-foreground font-bold shadow-xs' : 'text-muted-foreground'"
                >
                  Alabaster
                </button>
                <button
                  type="button"
                  @click="theme = 'onyx'"
                  class="rounded px-2 py-1 transition-all"
                  :class="theme === 'onyx' ? 'bg-card text-foreground font-bold shadow-xs' : 'text-muted-foreground'"
                >
                  Onyx
                </button>
                <button
                  type="button"
                  @click="theme = 'emerald'"
                  class="rounded px-2 py-1 transition-all"
                  :class="theme === 'emerald' ? 'bg-card text-primary font-bold shadow-xs' : 'text-muted-foreground'"
                >
                  Jade
                </button>
              </div>
            </div>
          </div>

          <div
            class="relative mx-auto flex flex-col justify-between overflow-hidden rounded-xl border p-6 text-center shadow-md transition-all"
            :class="[
              ratio === '1:1' ? 'aspect-square max-w-xs' : 'aspect-9/16 max-w-64',
              theme === 'alabaster' ? 'border-border/80 bg-[#FAF8F5] text-slate-900' : '',
              theme === 'onyx' ? 'border-zinc-800 bg-[#0D0F12] text-zinc-100' : '',
              theme === 'emerald' ? 'border-emerald-900 bg-[#1B4D3E] text-white' : ''
            ]"
          >
            <span
              class="text-[10px] font-bold tracking-wider uppercase"
              :class="theme === 'emerald' ? 'text-amber-300' : 'text-emerald-700 dark:text-emerald-400'"
            >
              QS. {{ surahName }} : {{ verse.verse_number }}
            </span>

            <p
              class="quran-arabic my-auto text-lg leading-relaxed line-clamp-4"
              dir="rtl"
            >
              {{ verse.text_uthmani }}
            </p>

            <div class="space-y-1">
              <div
                class="mx-auto h-0.5 w-10"
                :class="theme === 'emerald' ? 'bg-amber-300/50' : 'bg-emerald-600/30'"
              />
              <p
                class="text-[10px] italic leading-snug line-clamp-3"
                :class="theme === 'emerald' ? 'text-emerald-100' : 'text-slate-600 dark:text-zinc-400'"
              >
                "{{ cleanTranslation }}"
              </p>
              <span class="block text-[8px] opacity-60 pt-1">Digital Al-Qur'an</span>
            </div>
          </div>
        </div>

        <footer class="border-t border-border p-4 bg-muted/20 flex items-center justify-between gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Tutup
          </button>

          <button
            type="button"
            @click="handleDownload"
            :disabled="isGenerating"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
          >
            <Download class="h-3.5 w-3.5" />
            {{ isGenerating ? 'Merender...' : 'Unduh Gambar (PNG)' }}
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Download } from '@lucide/vue';
import { generateAyatCardBlob, type CardRatio, type CardTheme } from '~/utils/exportCanvas';
import { stripHtmlTags } from '~/utils/quranValidation';
import type { Verse } from '~/types/quran';

const props = defineProps<{
  isOpen: boolean;
  verse: Verse | null;
  surahName: string;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const ratio = ref<CardRatio>('1:1');
const theme = ref<CardTheme>('alabaster');
const isGenerating = ref(false);

const cleanTranslation = computed(() => {
  if (!props.verse?.translations || props.verse.translations.length === 0) return '';
  return stripHtmlTags(props.verse.translations[0]?.text || '');
});

const handleDownload = async () => {
  if (!props.verse) return;
  isGenerating.value = true;
  try {
    const dataUrl = await generateAyatCardBlob({
      arabicText: props.verse.text_uthmani,
      translationText: cleanTranslation.value,
      surahName: props.surahName,
      verseNumber: props.verse.verse_number,
      verseKey: props.verse.verse_key,
      theme: theme.value,
      ratio: ratio.value
    });

    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `Ayat_${props.surahName}_${props.verse.verse_key.replace(':', '_')}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (err) {
    console.error('Failed to generate image card', err);
  } finally {
    isGenerating.value = false;
  }
};
</script>
