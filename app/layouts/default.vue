<template>
  <div>
    <header>
      <nav>
        <h1><NuxtLink to="/">Al-Quran Digital</NuxtLink></h1>
        <ul>
          <li><NuxtLink to="/">Beranda</NuxtLink></li>
          <li><NuxtLink to="/bookmark">Penanda Buku</NuxtLink></li>
          <li><NuxtLink to="/search">Pencarian</NuxtLink></li>
        </ul>
        <button type="button" @click="isSettingsOpen = true">Pengaturan</button>
      </nav>
    </header>

    <main>
      <slot />
    </main>

    <QuranAudioPlayerBar />

    <QuranSettingsDrawer :is-open="isSettingsOpen" @close="isSettingsOpen = false" />
  </div>
</template>

<script setup lang="ts">
const isSettingsOpen = ref(false);
</script>
