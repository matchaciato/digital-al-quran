<template>
  <QuranTafsirDrawer
    :is-open="isOpen"
    :verse-key="verseKey"
    @close="$emit('close')"
  />
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  verseKey: string;
}>();

defineEmits<{
  (e: 'close'): void;
}>();
</script>
