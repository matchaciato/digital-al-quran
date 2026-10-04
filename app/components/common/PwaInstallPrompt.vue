<template>
  <div>
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-full opacity-0"
    >
      <div
        v-if="!isOnline"
        role="status"
        aria-live="polite"
        class="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-3 bg-amber-600 px-4 py-2.5 text-white shadow-md text-xs sm:text-sm font-medium"
      >
        <div class="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <WifiOff class="h-4 w-4 shrink-0 animate-pulse" aria-hidden="true" />
          <span>
            <strong>Mode Offline:</strong> Anda tidak terhubung ke internet. Ayat, tafsir, dan audio yang telah dicache tetap dapat dibuka tanpa gangguan.
          </span>
        </div>
      </div>
      <div
        v-else-if="showBackOnline"
        role="status"
        aria-live="polite"
        class="fixed top-0 inset-x-0 z-50 flex items-center justify-between gap-3 bg-emerald-600 px-4 py-2 text-white shadow-md text-xs sm:text-sm font-medium"
      >
        <div class="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <Wifi class="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Kembali online. Seluruh fitur tersinkronisasi.</span>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-10 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-10 opacity-0"
    >
      <div
        v-if="needRefresh"
        role="alert"
        class="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:max-w-md z-50 rounded-xl border border-primary/30 bg-card p-4 shadow-xl backdrop-blur-md"
      >
        <div class="flex items-start gap-3">
          <div class="rounded-lg bg-primary/10 p-2 text-primary">
            <RefreshCw class="h-5 w-5 animate-spin" aria-hidden="true" />
          </div>
          <div class="flex-1 space-y-1">
            <h4 class="text-xs font-bold text-foreground">Pembaruan Sistem Tersedia</h4>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Versi terbaru Al-Qur'an Digital siap digunakan dengan perbaikan performa terkini.
            </p>
            <div class="flex items-center gap-2 pt-2">
              <button
                type="button"
                @click="updateApp"
                class="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Muat Ulang Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-10 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-10 opacity-0"
    >
      <aside
        v-if="showInstallPrompt && !isStandalone"
        role="complementary"
        aria-label="Pasang Aplikasi"
        class="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:max-w-sm z-40 rounded-xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-md"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm shadow-xs">
              ق
            </div>
            <div>
              <h4 class="text-xs font-bold text-foreground">Pasang Al-Qur'an Digital</h4>
              <p class="text-[11px] text-muted-foreground leading-snug">
                Akses instan dari layar utama & hemat kuota internet.
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="dismissInstall"
            class="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
            aria-label="Tutup penawaran pasang aplikasi"
          >
            <X class="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <div class="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            @click="dismissInstall"
            class="rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
          >
            Nanti
          </button>
          <button
            type="button"
            @click="handleInstallClick"
            class="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Download class="h-3 w-3" aria-hidden="true" />
            <span>Pasang Aplikasi</span>
          </button>
        </div>
      </aside>
    </Transition>

    <Teleport to="body">
      <div
        v-if="showIosModal"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-4"
        @click.self="showIosModal = false"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-modal-title"
          class="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4"
        >
          <div class="flex items-center justify-between">
            <h3 id="ios-modal-title" class="text-sm font-bold text-foreground">
              Pasang di Perangkat Apple (iOS)
            </h3>
            <button
              type="button"
              @click="showIosModal = false"
              class="rounded-md p-1 text-muted-foreground hover:bg-muted"
              aria-label="Tutup petunjuk"
            >
              <X class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <p class="text-xs text-muted-foreground leading-relaxed">
            Untuk memasang Al-Qur'an Digital pada iPhone atau iPad Anda:
          </p>
          <ol class="space-y-2.5 text-xs text-foreground/90 pl-1 list-decimal list-inside">
            <li class="leading-relaxed">
              Ketuk tombol <strong>Bagikan (Share)</strong>
              <Share2 class="inline h-3.5 w-3.5 mx-1 text-primary" aria-hidden="true" />
              di bilah bawah Safari.
            </li>
            <li class="leading-relaxed">
              Gulir menu ke bawah lalu pilih <strong>Tambah ke Layar Utama (Add to Home Screen)</strong>.
            </li>
            <li class="leading-relaxed">
              Ketuk <strong>Tambah</strong> di sudut kanan atas untuk selesai.
            </li>
          </ol>
          <button
            type="button"
            @click="showIosModal = false"
            class="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            Mengerti
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useOnline } from '@vueuse/core';
import { WifiOff, Wifi, Download, X, RefreshCw, Share2 } from '@lucide/vue';

const isOnline = useOnline();
const showBackOnline = ref(false);
let onlineTimer: ReturnType<typeof setTimeout> | null = null;

// Track online transition
watch(isOnline, (online, oldVal) => {
  if (online && oldVal === false) {
    showBackOnline.value = true;
    if (onlineTimer) clearTimeout(onlineTimer);
    onlineTimer = setTimeout(() => {
      showBackOnline.value = false;
    }, 3500);
  } else if (!online) {
    showBackOnline.value = false;
  }
});

// PWA installation state
const deferredPrompt = ref<any>(null);
const showInstallPrompt = ref(false);
const isStandalone = ref(false);
const showIosModal = ref(false);
const isIos = ref(false);

// Nuxt PWA update state
const nuxtApp = useNuxtApp();
const pwa = computed(() => (nuxtApp as any).$pwa);
const needRefresh = computed(() => Boolean(pwa.value?.needRefresh));

const updateApp = async () => {
  if (pwa.value?.updateServiceWorker) {
    await pwa.value.updateServiceWorker(true);
  } else if (import.meta.client) {
    window.location.reload();
  }
};

onMounted(() => {
  if (!import.meta.client) return;

  // Check standalone mode
  const isMatchMediaStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isNavigatorStandalone = Boolean((window.navigator as any).standalone);
  isStandalone.value = isMatchMediaStandalone || isNavigatorStandalone;

  // Detect iOS Safari
  const ua = window.navigator.userAgent;
  isIos.value = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;

  // Check if dismissed recently
  const dismissedTime = localStorage.getItem('pwa_install_dismissed_at');
  const now = Date.now();
  const isDismissedRecently = dismissedTime && (now - Number(dismissedTime) < 1000 * 60 * 60 * 24 * 7); // 7 days

  if (!isStandalone.value && !isDismissedRecently) {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      deferredPrompt.value = e;
      showInstallPrompt.value = true;
    });

    // On iOS Safari, show prompt if never dismissed
    if (isIos.value && !localStorage.getItem('pwa_ios_hint_shown')) {
      showInstallPrompt.value = true;
    }
  }
});

const handleInstallClick = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    if (outcome === 'accepted') {
      showInstallPrompt.value = false;
    }
    deferredPrompt.value = null;
  } else if (isIos.value) {
    showInstallPrompt.value = false;
    showIosModal.value = true;
    localStorage.setItem('pwa_ios_hint_shown', '1');
  }
};

const dismissInstall = () => {
  showInstallPrompt.value = false;
  if (import.meta.client) {
    localStorage.setItem('pwa_install_dismissed_at', String(Date.now()));
  }
};

onUnmounted(() => {
  if (onlineTimer) clearTimeout(onlineTimer);
});
</script>
