<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      @click.self="closeDrawer"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-drawer-title"
        class="flex h-full w-full max-w-md flex-col justify-between overflow-y-auto border-l border-border bg-background p-6 shadow-2xl transition-transform"
      >
        <div class="space-y-6">
          <div class="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 id="settings-drawer-title" class="text-lg font-semibold tracking-tight text-foreground">Pengaturan Tampilan</h2>
              <p class="text-xs text-muted-foreground">Sesuaikan preferensi membaca dan tipografi</p>
            </div>
            <button
              @click="closeDrawer"
              class="rounded-md border border-input p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Tutup pengaturan"
            >
              <X class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div class="space-y-5">
            <h3 class="eyebrow">Ukuran Tipografi</h3>
            
            <div class="space-y-2 rounded-lg border border-border bg-card p-4">
              <div class="flex justify-between text-xs">
                <span class="font-medium text-foreground">Teks Arab</span>
                <span class="font-semibold text-primary">{{ settings.arabicFontSize }}px</span>
              </div>
              <input
                type="range"
                min="18"
                max="48"
                aria-label="Ukuran font teks Arab"
                :value="settings.arabicFontSize"
                @input="e => settings.setArabicFontSize(Number((e.target as HTMLInputElement).value))"
                class="w-full cursor-pointer accent-primary"
              />
              <p
                class="quran-arabic mt-2 rounded bg-muted/40 p-3 text-center text-foreground"
                :style="{ fontSize: `${settings.arabicFontSize}px` }"
                dir="rtl"
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>

            <div class="space-y-2 rounded-lg border border-border bg-card p-4">
              <div class="flex justify-between text-xs">
                <span class="font-medium text-foreground">Teks Terjemahan</span>
                <span class="font-semibold text-primary">{{ settings.translationFontSize }}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                aria-label="Ukuran font teks terjemahan"
                :value="settings.translationFontSize"
                @input="e => settings.setTranslationFontSize(Number((e.target as HTMLInputElement).value))"
                class="w-full cursor-pointer accent-primary"
              />
              <p
                class="mt-2 text-muted-foreground text-sm"
                :style="{ fontSize: `${settings.translationFontSize}px` }"
              >
                Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.
              </p>
            </div>
          </div>

          <div class="space-y-4 border-t border-border pt-5">
            <h3 class="eyebrow">Elemen Tampilan</h3>

            <div class="flex items-center justify-between py-1">
              <div>
                <p class="text-sm font-medium text-foreground">Transliterasi Latin</p>
                <p class="text-xs text-muted-foreground">Tampilkan teks ejaan latin di bawah ayat</p>
              </div>
              <button
                type="button"
                @click="settings.toggleLatin()"
                :class="[settings.showLatin ? 'bg-primary' : 'bg-muted border border-border']"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                role="switch"
                aria-label="Alihkan tampilan transliterasi latin"
                :aria-checked="settings.showLatin"
              >
                <span
                  :class="[settings.showLatin ? 'translate-x-6 bg-primary-foreground' : 'translate-x-1 bg-muted-foreground']"
                  class="inline-block h-4 w-4 transform rounded-full transition-transform"
                />
              </button>
            </div>

            <div class="flex items-center justify-between py-1">
              <div>
                <p class="text-sm font-medium text-foreground">Terjemahan Ayat</p>
                <p class="text-xs text-muted-foreground">Tampilkan arti terjemahan resmi</p>
              </div>
              <button
                type="button"
                @click="settings.toggleTranslation()"
                :class="[settings.showTranslation ? 'bg-primary' : 'bg-muted border border-border']"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                role="switch"
                aria-label="Alihkan tampilan terjemahan ayat"
                :aria-checked="settings.showTranslation"
              >
                <span
                  :class="[settings.showTranslation ? 'translate-x-6 bg-primary-foreground' : 'translate-x-1 bg-muted-foreground']"
                  class="inline-block h-4 w-4 transform rounded-full transition-transform"
                />
              </button>
            </div>

            <div class="flex items-center justify-between py-1">
              <div>
                <p class="text-sm font-medium text-foreground">Mode Gelap (Dark Mode)</p>
                <p class="text-xs text-muted-foreground">Tema kontras nyaman untuk malam hari</p>
              </div>
              <button
                type="button"
                @click="settings.toggleDarkMode()"
                :class="[settings.isDarkMode ? 'bg-primary' : 'bg-muted border border-border']"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                role="switch"
                aria-label="Alihkan tema mode gelap"
                :aria-checked="settings.isDarkMode"
              >
                <span
                  :class="[settings.isDarkMode ? 'translate-x-6 bg-primary-foreground' : 'translate-x-1 bg-muted-foreground']"
                  class="inline-block h-4 w-4 transform rounded-full transition-transform"
                />
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-border pt-5">
          <button
            type="button"
            @click="closeDrawer"
            class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Simpan & Selesai
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue';
import { useSettingsStore } from '~/stores/useSettingsStore';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const settings = useSettingsStore();

const closeDrawer = () => {
  emit('close');
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    closeDrawer();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
