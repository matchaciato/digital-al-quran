<template>
  <div>
    <AppHeader />

    <main>
      <slot />
    </main>

    <QuranAudioPlayerBar />

    <QuranSettingsDrawer :is-open="isSettingsOpen" @close="isSettingsOpen = false" />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue';

const isSettingsOpen = ref(false);
</script>
