<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end transition-opacity">
    <div class="w-full max-w-md bg-white dark:bg-zinc-900 h-full p-6 shadow-xl flex flex-col justify-between overflow-y-auto">
      <div class="space-y-6">
        <div class="flex items-center justify-between border-b pb-4 dark:border-zinc-800">
          <h2 class="text-xl font-bold text-zinc-900 dark:text-zinc-100">Pengaturan Tampilan</h2>
          <button @click="closeDrawer" class="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Ukuran Teks</h3>
          
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-zinc-700 dark:text-zinc-300">Teks Arab</span>
              <span class="font-semibold text-emerald-600">{{ settings.arabicFontSize }}px</span>
            </div>
            <input
              type="range"
              min="16"
              max="50"
              :value="settings.arabicFontSize"
              @input="e => settings.setArabicFontSize(Number((e.target as HTMLInputElement).value))"
              class="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-zinc-700 dark:text-zinc-300">Teks Terjemahan</span>
              <span class="font-semibold text-emerald-600">{{ settings.translationFontSize }}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="30"
              :value="settings.translationFontSize"
              @input="e => settings.setTranslationFontSize(Number((e.target as HTMLInputElement).value))"
              class="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        <div class="space-y-4 pt-4 border-t dark:border-zinc-800">
          <h3 class="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Tampilan Konten</h3>

          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tampilkan Latin (Transliterasi)</span>
            <button
              @click="settings.toggleLatin()"
              :class="[settings.showLatin ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700']"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span
                :class="[settings.showLatin ? 'translate-x-6' : 'translate-x-1']"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Tampilkan Terjemahan</span>
            <button
              @click="settings.toggleTranslation()"
              :class="[settings.showTranslation ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700']"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span
                :class="[settings.showTranslation ? 'translate-x-6' : 'translate-x-1']"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">Mode Gelap</span>
            <button
              @click="settings.toggleDarkMode()"
              :class="[settings.isDarkMode ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700']"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            >
              <span
                :class="[settings.isDarkMode ? 'translate-x-6' : 'translate-x-1']"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>
        </div>
      </div>

      <div class="pt-6 border-t dark:border-zinc-800">
        <button
          @click="closeDrawer"
          class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
          Selesai
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue';
import { useSettingsStore } from '~/stores/useSettingsStore';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const settings = useSettingsStore();

const closeDrawer = () => {
  emit('close');
};
</script>
