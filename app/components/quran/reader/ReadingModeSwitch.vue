<template>
  <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
    <p id="reading-mode-label" class="eyebrow">Mode membaca</p>
    <div role="group" aria-labelledby="reading-mode-label" class="inline-flex rounded-md border border-input p-0.5 text-sm">
      <button
        v-for="mode in modes"
        :key="mode.id"
        type="button"
        class="h-9 rounded px-3 font-medium transition-colors"
        :class="
          settings.readingMode === mode.id
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        "
        :aria-pressed="settings.readingMode === mode.id"
        @click="settings.setReadingMode(mode.id)"
      >
        {{ mode.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore, type ReadingMode } from '~/stores/useSettingsStore';

const settings = useSettingsStore();

const modes: Array<{ id: ReadingMode; label: string }> = [
  { id: 'verse', label: 'Ayat' },
  { id: 'mushaf', label: 'Mushaf' },
  { id: 'zen', label: 'Zen' },
  { id: 'parallel', label: 'Komparasi' }
];
</script>
