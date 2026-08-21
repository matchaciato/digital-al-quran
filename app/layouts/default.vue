<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col transition-colors">
    <AppHeader @open-command="shortcuts.openCommandPalette()" />

    <main class="flex-1 w-full">
      <slot />
    </main>

    <QuranAudioPlayerBar />

    <QuranSettingsDrawer
      :is-open="settings.isSettingsOpen"
      @close="settings.closeSettings()"
    />

    <CommonCommandPalette
      :is-open="shortcuts.isCommandPaletteOpen.value"
      @close="shortcuts.closeCommandPalette()"
    />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue';
import { useSettingsStore } from '~/stores/useSettingsStore';
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts';

const settings = useSettingsStore();
const shortcuts = useKeyboardShortcuts();
</script>
