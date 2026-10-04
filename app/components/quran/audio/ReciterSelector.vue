<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs transition-opacity"
      @click.self="$emit('close')"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reciter-modal-title"
        class="flex max-h-[85dvh] w-full max-w-lg flex-col justify-between overflow-hidden rounded-lg border border-border bg-background shadow-2xl transition-all"
      >
        <header class="flex items-center justify-between border-b border-border p-4 sm:p-5 bg-card/40">
          <div class="space-y-0.5 min-w-0 pr-2">
            <span class="eyebrow">
              Katalog Qari Internasional
            </span>
            <h2 id="reciter-modal-title" class="truncate text-base font-bold text-foreground">
              Pilih Qari Murottal & Mujawwad
            </h2>
          </div>
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-md border border-input p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0"
            aria-label="Tutup jendela pemilih qari"
          >
            <X class="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div class="overflow-y-auto p-3 sm:p-4 space-y-2">
          <button
            type="button"
            v-for="reciter in RECITERS_CATALOG"
            :key="reciter.id"
            @click="selectReciter(reciter.id)"
            class="flex w-full items-center justify-between gap-3 rounded-xl border p-3 sm:p-4 text-left transition-all"
            :class="[
              settings.selectedReciterId === reciter.id
                ? 'border-primary bg-primary/10 shadow-xs'
                : 'border-border/70 bg-card hover:border-border hover:bg-muted/40'
            ]"
          >
            <div class="space-y-1 min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span class="font-semibold text-xs sm:text-sm text-foreground truncate">
                  {{ reciter.name }}
                </span>
                <span
                  class="rounded px-1.5 py-0.5 text-[9px] sm:text-xs font-semibold shrink-0"
                  :class="[
                    reciter.style === 'Mujawwad'
                      ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300'
                      : 'bg-primary/10 text-primary'
                  ]"
                >
                  {{ reciter.style }}
                </span>
              </div>
              <p class="text-xs sm:text-xs text-muted-foreground">
                {{ reciter.country || 'Internasional' }}
              </p>
            </div>

            <span class="quran-arabic text-base sm:text-lg text-foreground/80 shrink-0" dir="rtl">
              {{ reciter.arabicName }}
            </span>
          </button>
        </div>

        <footer class="border-t border-border p-3.5 sm:p-4 bg-muted/20 flex justify-end">
          <button
            type="button"
            @click="$emit('close')"
            class="inline-flex h-9 items-center rounded-md bg-primary px-5 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            Selesai
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue';
import { useSettingsStore } from '~/stores/useSettingsStore';
import { RECITERS_CATALOG } from '~/constants/reciters';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const settings = useSettingsStore();

const selectReciter = (id: number) => {
  settings.setReciterId(id);
  emit('close');
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('close');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>
