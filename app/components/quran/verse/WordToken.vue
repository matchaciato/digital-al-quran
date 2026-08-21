<template>
  <span class="relative inline-block group">
    <button
      type="button"
      @click="handleClick"
      class="quran-arabic inline-block rounded-md px-1 py-0.5 transition-colors duration-150 hover:bg-primary/15 hover:text-primary active:scale-95 focus:outline-none"
      :class="{ 'text-primary font-semibold': isSelected }"
    >
      {{ word.text_uthmani }}
    </button>

    <span
      class="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 flex-col items-center rounded-lg border border-border/80 bg-popover px-2.5 py-1.5 text-center text-xs shadow-md group-hover:flex z-30 min-w-28 transition-all"
    >
      <span class="font-semibold text-foreground">
        {{ wordMeaning || 'Kata' }}
      </span>
      <span v-if="wordTransliteration" class="text-[10px] text-muted-foreground italic">
        {{ wordTransliteration }}
      </span>
      <span class="mt-1 text-[9px] text-primary/80">
        Klik untuk bedah akar kata
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { useMorphology } from '~/composables/useMorphology';
import { stripHtmlTags } from '~/utils/quranValidation';
import type { Word } from '~/types/quran';

const props = defineProps<{
  word: Word;
  verseKey: string;
  isSelected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'inspect', word: Word): void;
}>();

const morphology = useMorphology();

const wordMeaning = computed(() => {
  return stripHtmlTags(props.word.text_indonesian || props.word.translation?.text || '');
});

const wordTransliteration = computed(() => {
  return stripHtmlTags(props.word.transliteration?.text || '');
});

const handleClick = () => {
  if (props.word.audio_url) {
    morphology.playWordAudio(props.word.audio_url);
  }
  emit('inspect', props.word);
};
</script>
