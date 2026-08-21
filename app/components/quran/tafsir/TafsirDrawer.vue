<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      @click.self="closeDrawer"
    >
      <div
        class="flex h-full w-full max-w-2xl flex-col justify-between overflow-hidden border-l border-border bg-background shadow-2xl transition-transform duration-200"
      >
        <header class="flex items-center justify-between border-b border-border p-5 bg-card/50">
          <div class="space-y-0.5">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Kajian & Eksplorasi Tafsir
            </span>
            <h2 class="text-base font-bold text-foreground">
              Tafsir & Asbabun Nuzul Ayat {{ verseKey }}
            </h2>
          </div>
          <button
            type="button"
            @click="closeDrawer"
            class="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Tutup drawer tafsir"
          >
            <X class="h-4 w-4" />
          </button>
        </header>

        <div class="border-b border-border bg-muted/30 px-5 py-2.5 overflow-x-auto">
          <div class="inline-flex gap-1.5 min-w-max">
            <button
              type="button"
              v-for="source in TAFSIR_RESOURCES"
              :key="source.id"
              @click="handleSelectTafsir(source.id)"
              class="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
              :class="[
                activeTab === 'tafsir' && selectedTafsirId === source.id
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              ]"
            >
              {{ source.name }}
            </button>

            <button
              type="button"
              @click="activeTab = 'asbabun_nuzul'"
              class="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
              :class="[
                activeTab === 'asbabun_nuzul'
                  ? 'bg-amber-600 text-white font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              ]"
            >
              Asbabun Nuzul
            </button>
          </div>
        </div>

        <main class="flex-1 overflow-y-auto p-6 space-y-6">
          <div v-if="activeTab === 'tafsir'">
            <div class="mb-4 rounded-xl border border-border/70 bg-card p-4 space-y-1">
              <span class="text-xs font-bold text-foreground">{{ activeTafsirResource?.name }}</span>
              <p class="text-xs text-muted-foreground">{{ activeTafsirResource?.description }}</p>
            </div>

            <div v-if="isLoading" class="space-y-3 py-12 text-center">
              <div class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p class="text-xs text-muted-foreground">Memuat teks tafsir...</p>
            </div>

            <div v-else-if="error" class="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
              <p class="text-xs font-medium text-destructive">{{ error }}</p>
              <button
                type="button"
                @click="loadTafsir"
                class="mt-3 rounded bg-muted px-3 py-1 text-xs font-medium text-foreground hover:bg-border"
              >
                Coba Lagi
              </button>
            </div>

            <div v-else-if="tafsirContent" class="space-y-4">
              <div
                class="leading-relaxed text-sm text-foreground/90 space-y-4 font-normal tracking-wide select-text [&>p]:mb-3 [&>h4]:font-bold [&>h4]:text-base [&>h4]:mt-4"
                v-html="tafsirContent.text"
              />
            </div>
          </div>

          <div v-else-if="activeTab === 'asbabun_nuzul'">
            <div v-if="asbabunNuzulData" class="space-y-4">
              <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-2">
                <span class="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Latar Belakang Turunnya Ayat (Asbabun Nuzul)
                </span>
                <h3 class="text-base font-bold text-foreground">
                  {{ asbabunNuzulData.title }}
                </h3>
                <p class="text-xs text-muted-foreground">
                  Sumber Riwayat: {{ asbabunNuzulData.source }}
                </p>
              </div>

              <div class="rounded-xl border border-border/80 bg-card p-6 leading-relaxed text-sm text-foreground space-y-3">
                <p>{{ asbabunNuzulData.narration }}</p>
              </div>
            </div>

            <div v-else class="py-16 text-center space-y-2">
              <span class="text-3xl">📖</span>
              <h3 class="text-sm font-bold text-foreground">Tidak Ada Riwayat Khusus</h3>
              <p class="text-xs text-muted-foreground max-w-sm mx-auto">
                Ayat {{ verseKey }} tidak memiliki riwayat asbabun nuzul khusus yang tercatat tersendiri. Silakan pelajari makna ayat pada tab Tafsir Ulama.
              </p>
            </div>
          </div>
        </main>

        <footer class="border-t border-border p-4 bg-muted/20 flex justify-end">
          <button
            type="button"
            @click="closeDrawer"
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
import { useQuranApi } from '~/composables/useQuranApi';
import { useSettingsStore } from '~/stores/useSettingsStore';
import { TAFSIR_RESOURCES } from '~/constants/tafsirs';
import { ASBABUN_NUZUL_DATABASE } from '~/constants/asbabunNuzul';
import type { Tafsir } from '~/types/quran';

const props = defineProps<{
  isOpen: boolean;
  verseKey: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const quranApi = useQuranApi();
const settings = useSettingsStore();

const activeTab = ref<'tafsir' | 'asbabun_nuzul'>('tafsir');
const selectedTafsirId = ref<number>(settings.selectedTafsirId || 168);
const tafsirContent = ref<Tafsir | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const activeTafsirResource = computed(() => {
  return TAFSIR_RESOURCES.find(t => t.id === selectedTafsirId.value) || TAFSIR_RESOURCES[0];
});

const asbabunNuzulData = computed(() => {
  return ASBABUN_NUZUL_DATABASE[props.verseKey] || null;
});

const loadTafsir = async () => {
  if (!props.verseKey) return;
  isLoading.value = true;
  error.value = null;
  try {
    const res = await quranApi.getVerseTafsir(selectedTafsirId.value, props.verseKey);
    tafsirContent.value = res.tafsir;
  } catch (err: any) {
    error.value = 'Gagal memuat teks tafsir untuk sumber ini.';
  } finally {
    isLoading.value = false;
  }
};

const handleSelectTafsir = (id: number) => {
  activeTab.value = 'tafsir';
  selectedTafsirId.value = id;
  settings.setTafsirId(id);
  loadTafsir();
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    activeTab.value = 'tafsir';
    loadTafsir();
  }
});

watch(() => props.verseKey, (newVal) => {
  if (props.isOpen && newVal) {
    loadTafsir();
  }
});

const closeDrawer = () => {
  emit('close');
};
</script>
