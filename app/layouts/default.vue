<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <a href="#main-content" class="skip-link">Lewati ke konten utama</a>

    <AppHeader @open-command="shortcuts.openCommandPalette()" />

    <main id="main-content" tabindex="-1" class="w-full flex-1 pb-20 outline-none md:pb-0">
      <slot />
    </main>

    <QuranAudioPlayerBar />

    <CommonMobileBottomNav />

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
