<template>
  <div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
    <!-- Subtle Background Ambient Glow -->
    <div class="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-40 right-1/4 -z-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

    <main class="w-full max-w-xl text-center space-y-8">
      <!-- Spiritual & Aesthetic Calligraphy Header -->
      <div class="space-y-3">
        <div class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <span>{{ is404 ? 'Kode Status 404' : 'Kode Status ' + (error?.statusCode || 500) }}</span>
        </div>

        <p class="quran-arabic text-3xl sm:text-4xl text-foreground/90 pt-2" dir="rtl">
          فَإِنَّ مَعَ الْعُسْرِ يُسْرًا
        </p>
        <p class="text-xs text-muted-foreground italic font-serif">
          "Maka sesungguhnya beserta kesulitan ada kemudahan." (QS. Asy-Syarh: 5)
        </p>
      </div>

      <!-- Error Card -->
      <div class="rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-sm space-y-6">
        <div class="space-y-2">
          <h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {{ is404 ? 'Halaman Tidak Ditemukan' : 'Terjadi Kendala Sistem' }}
          </h1>
          <p class="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            @click="handleGoHome"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:opacity-90 active:scale-95"
          >
            &larr; Kembali ke Beranda
          </button>

          <button
            type="button"
            @click="handleReload"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 px-5 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted active:scale-95"
          >
            Muat Ulang Halaman
          </button>
        </div>

        <!-- Quick Access to Essential Surahs -->
        <div class="border-t border-border/50 pt-5 space-y-3">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Akses Cepat Surah Pilihan
          </p>
          <div class="flex flex-wrap items-center justify-center gap-2 text-xs">
            <NuxtLink
              v-for="item in quickLinks"
              :key="item.path"
              :to="item.path"
              @click="handleNavigate(item.path)"
              class="rounded-lg border border-border/70 bg-background px-3 py-1.5 font-medium text-foreground/80 hover:border-primary/50 hover:text-primary transition-colors"
            >
              {{ item.title }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Developer Diagnostics (if in dev mode) -->
      <details v-if="isDev && error?.stack" class="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-left text-xs">
        <summary class="cursor-pointer font-semibold text-destructive">
          Detail Kesalahan Teknis (Mode Pengembang)
        </summary>
        <pre class="mt-2 overflow-x-auto p-2 bg-background/80 rounded font-mono text-[11px] text-destructive/90 whitespace-pre-wrap">
{{ error.stack }}
        </pre>
      </details>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const isDev = import.meta.dev;
const is404 = computed(() => props.error?.statusCode === 404);

const errorMessage = computed(() => {
  if (props.error?.statusMessage) {
    return props.error.statusMessage;
  }
  if (is404.value) {
    return 'Halaman, Surah, atau Juz yang Anda cari tidak tersedia atau tautan telah diperbarui.';
  }
  return 'Sistem mengalami gangguan saat memproses permintaan. Silakan muat ulang atau periksa koneksi internet Anda.';
});

const quickLinks = [
  { title: 'Al-Fatihah', path: '/surah/1' },
  { title: 'Al-Baqarah', path: '/surah/2' },
  { title: 'Al-Kahf', path: '/surah/18' },
  { title: 'Yasin', path: '/surah/36' },
  { title: 'Al-Mulk', path: '/surah/67' },
  { title: 'Juz 1', path: '/juz/1' },
  { title: 'Juz 30', path: '/juz/30' }
];

const handleGoHome = () => {
  clearError({ redirect: '/' });
};

const handleNavigate = (path: string) => {
  clearError({ redirect: path });
};

const handleReload = () => {
  if (import.meta.client) {
    window.location.reload();
  }
};
</script>
