<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs transition-opacity"
      @click.self="$emit('close')"
    >
      <div
        class="flex max-h-[90dvh] w-full max-w-md flex-col justify-between overflow-hidden rounded-2xl border border-border bg-background shadow-2xl transition-all"
      >
        <header class="flex items-center justify-between border-b border-border p-4 sm:p-5 bg-card/40">
          <div class="space-y-0.5 min-w-0 pr-2">
            <span class="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-primary">
              Studio Hafalan (Hifz)
            </span>
            <h2 class="truncate text-sm sm:text-base font-bold text-foreground">
              A-B Loop Memorization
            </h2>
          </div>
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0"
            aria-label="Tutup"
          >
            <X class="h-4 w-4" />
          </button>
        </header>

        <div class="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          <div class="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div class="space-y-1">
              <label class="text-[11px] sm:text-xs font-semibold text-foreground">Ayat Awal (A)</label>
              <input
                type="text"
                v-model="startKey"
                placeholder="misal: 1:1"
                class="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div class="space-y-1">
              <label class="text-[11px] sm:text-xs font-semibold text-foreground">Ayat Akhir (B)</label>
              <input
                type="text"
                v-model="endKey"
                placeholder="misal: 1:7"
                class="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div class="space-y-2 rounded-xl border border-border/70 bg-card p-3.5 sm:p-4">
            <div class="flex justify-between text-xs">
              <span class="font-medium text-foreground">Pengulangan Tiap Ayat</span>
              <span class="font-bold text-primary">{{ repeatCount }}x Kali</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              v-model.number="repeatCount"
              class="w-full cursor-pointer accent-primary"
              aria-label="Jumlah pengulangan tiap ayat"
            />
            <p class="text-[10px] sm:text-[11px] text-muted-foreground">
              Setiap ayat diulang {{ repeatCount }}x sebelum beralih ke ayat berikutnya.
            </p>
          </div>

          <div class="space-y-2 rounded-xl border border-border/70 bg-card p-3.5 sm:p-4">
            <div class="flex justify-between text-xs">
              <span class="font-medium text-foreground">Jeda Hening Antar Repetisi</span>
              <span class="font-bold text-primary">{{ pauseGap }} Detik</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              v-model.number="pauseGap"
              class="w-full cursor-pointer accent-primary"
              aria-label="Jeda hening antar pengulangan"
            />
            <p class="text-[10px] sm:text-[11px] text-muted-foreground">
              Jeda hening untuk melafalkan sendiri hafalan Anda sebelum qari mengulang.
            </p>
          </div>
        </div>

        <footer class="border-t border-border p-3.5 sm:p-4 bg-muted/20 flex items-center justify-between gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Batal
          </button>
          <button
            type="button"
            @click="handleStart"
            class="rounded-lg bg-primary px-4 sm:px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 active:scale-95 transition-all"
          >
            Mulai Sesi Hafalan &rarr;
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X } from '@lucide/vue';

const props = defineProps<{
  isOpen: boolean;
  initialStartKey?: string;
  initialEndKey?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'start', config: { startKey: string; endKey: string; repeatCount: number; pauseGap: number }): void;
}>();

const startKey = ref(props.initialStartKey || '1:1');
const endKey = ref(props.initialEndKey || '1:7');
const repeatCount = ref(3);
const pauseGap = ref(2);

watch(() => props.initialStartKey, (val) => {
  if (val) startKey.value = val;
});
watch(() => props.initialEndKey, (val) => {
  if (val) endKey.value = val;
});

const handleStart = () => {
  emit('start', {
    startKey: startKey.value.trim(),
    endKey: endKey.value.trim(),
    repeatCount: repeatCount.value,
    pauseGap: pauseGap.value
  });
  emit('close');
};
</script>
