<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      @click.self="$emit('close')"
    >
      <div
        class="flex max-h-[85vh] w-full max-w-lg flex-col justify-between overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
      >
        <header class="flex items-center justify-between border-b border-border p-5">
          <div class="space-y-0.5">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Katalog Qari Internasional
            </span>
            <h2 class="text-base font-bold text-foreground">
              Pilih Qari Murottal & Mujawwad
            </h2>
          </div>
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X class="h-4 w-4" />
          </button>
        </header>

        <div class="overflow-y-auto p-4 space-y-2">
          <button
            type="button"
            v-for="reciter in RECITERS_CATALOG"
            :key="reciter.id"
            @click="selectReciter(reciter.id)"
            class="flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all"
            :class="[
              settings.selectedReciterId === reciter.id
                ? 'border-primary bg-primary/10 shadow-xs'
                : 'border-border/70 bg-card hover:border-border hover:bg-muted/40'
            ]"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-sm text-foreground">
                  {{ reciter.name }}
                </span>
                <span
                  class="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                  :class="[
                    reciter.style === 'Mujawwad'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-primary/10 text-primary'
                  ]"
                >
                  {{ reciter.style }}
                </span>
              </div>
              <p class="text-xs text-muted-foreground">
                {{ reciter.country || 'Internasional' }}
              </p>
            </div>

            <span class="quran-arabic text-lg text-foreground/80" dir="rtl">
              {{ reciter.arabicName }}
            </span>
          </button>
        </div>

        <footer class="border-t border-border p-4 bg-muted/20 flex justify-end">
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-95"
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

defineProps<{
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
</script>
