<template>
  <span class="inline-block">
    <button
      type="button"
      @click="handleClick"
      :title="tooltipText"
      class="quran-arabic inline-block rounded-md px-1 py-0.5 transition-colors duration-150 hover:bg-primary/15 hover:text-primary active:scale-95 focus:outline-none"
      :class="{ 'text-primary font-semibold': isSelected }"
      :aria-label="wordMeaning || word.text_uthmani"
    >
      {{ word.text_uthmani }}
    </button>
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

const tooltipText = computed(() => {
  const parts: string[] = [];
  if (wordMeaning.value) parts.push(wordMeaning.value);
  if (wordTransliteration.value) parts.push(`(${wordTransliteration.value})`);
  parts.push('— Klik untuk bedah kata');
  return parts.join(' ');
});

const handleClick = () => {
  if (props.word.audio_url) {
    morphology.playWordAudio(props.word.audio_url);
  }
  emit('inspect', props.word);
};
</script>
