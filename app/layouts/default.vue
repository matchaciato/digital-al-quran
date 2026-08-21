<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col">
    <AppHeader />

    <main class="flex-1 w-full">
      <slot />
    </main>

    <QuranAudioPlayerBar />

    <QuranSettingsDrawer
      :is-open="settings.isSettingsOpen"
      @close="settings.closeSettings()"
    />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue';
import { useSettingsStore } from '~/stores/useSettingsStore';

const settings = useSettingsStore();
</script>
