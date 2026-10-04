<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      @click.self="closeDrawer"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tafsir-drawer-title"
        class="flex h-full w-full max-w-2xl flex-col justify-between overflow-hidden border-l border-border bg-background shadow-2xl transition-transform duration-200"
      >
        <header class="flex items-center justify-between border-b border-border p-5 bg-card/50">
          <div class="space-y-0.5">
            <span class="eyebrow">
              Kajian & Eksplorasi Tafsir
            </span>
            <h2 id="tafsir-drawer-title" class="text-base font-bold text-foreground">
              Tafsir & Asbabun Nuzul Ayat {{ verseKey }}
            </h2>
          </div>
          <button
            type="button"
            @click="closeDrawer"
            class="rounded-md border border-input p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Tutup panel tafsir"
          >
            <X class="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div class="border-b border-border bg-muted/30 px-5 py-2.5 overflow-x-auto">
          <div class="inline-flex gap-1.5 min-w-max items-center">
            <button
              type="button"
              v-for="source in TAFSIR_RESOURCES"
              :key="source.id"
              @click="handleSelectTafsir(source.id)"
              class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all"
              :class="[
                activeTab === 'tafsir' && selectedTafsirId === source.id
                  ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              ]"
            >
              <span>{{ source.name }}</span>
              <span
                class="rounded px-1 py-0.2 text-[10px] uppercase font-mono font-semibold"
                :class="[
                  activeTab === 'tafsir' && selectedTafsirId === source.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                ]"
              >
                {{ source.language }}
              </span>
            </button>

            <div class="h-4 w-[1px] bg-border mx-1" aria-hidden="true" />

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
            <div class="mb-5 rounded-xl border border-border/70 bg-card p-4 space-y-1.5 shadow-xs">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-foreground">{{ activeTafsirResource?.name }}</span>
                  <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
                    {{ activeTafsirResource?.language === 'id' ? 'Bahasa Indonesia' : activeTafsirResource?.language === 'ar' ? 'Bahasa Arab' : 'English' }}
                  </span>
                </div>
                <button
                  v-if="tafsirContent && !isLoading && !error"
                  type="button"
                  @click="copyTafsirText"
                  class="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors"
                  :aria-label="copied ? 'Teks tafsir berhasil disalin' : 'Salin teks tafsir'"
                >
                  <Check v-if="copied" class="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <Copy v-else class="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{{ copied ? 'Tersalin' : 'Salin' }}</span>
                </button>
              </div>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ activeTafsirResource?.description }}</p>
            </div>

            <div v-if="isLoading" class="space-y-3 py-16 text-center">
              <div class="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p class="text-xs text-muted-foreground font-medium">Memuat tafsir ayat {{ verseKey }}...</p>
            </div>

            <div
              v-else-if="error"
              role="alert"
              class="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center space-y-3"
            >
              <div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle class="h-5 w-5" aria-hidden="true" />
              </div>
              <div class="space-y-1">
                <p class="text-sm font-semibold text-destructive">Gagal Memuat Tafsir</p>
                <p class="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  {{ error }}
                </p>
              </div>
              <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  @click="loadTafsir"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <RotateCw class="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Coba Lagi</span>
                </button>
                <button
                  v-if="selectedTafsirId !== 1"
                  type="button"
                  @click="handleSelectTafsir(1)"
                  class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <span>Buka Tafsir Kemenag RI</span>
                </button>
              </div>
            </div>

            <div v-else-if="tafsirContent" class="space-y-4">
              <div
                :dir="activeTafsirResource?.language === 'ar' ? 'rtl' : 'ltr'"
                class="leading-relaxed select-text"
                :class="[
                  activeTafsirResource?.language === 'ar'
                    ? 'font-arabic text-lg leading-loose text-right text-foreground font-normal space-y-4 [&_.green]:text-primary [&_.green]:font-semibold'
                    : 'text-sm md:text-base text-foreground/90 font-normal tracking-wide space-y-4 [&>p]:mb-3 [&>h1]:text-lg [&>h1]:font-bold [&>h1]:mt-4 [&>h2]:text-base [&>h2]:font-bold [&>h2]:mt-3 [&>h4]:font-bold [&>h4]:text-base [&>h4]:mt-4 [&_.green]:text-primary [&_.green]:font-semibold'
                ]"
                v-html="tafsirContent.text"
              />
            </div>
          </div>

          <div v-else-if="activeTab === 'asbabun_nuzul'">
            <div v-if="asbabunNuzulData" class="space-y-4">
              <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    Latar Belakang Turunnya Ayat (Asbabun Nuzul)
                  </span>
                  <button
                    type="button"
                    @click="copyAsbabunNuzul"
                    class="inline-flex items-center gap-1 text-xs text-amber-900 dark:text-amber-200 hover:opacity-80 px-2 py-1 rounded transition-colors"
                    :aria-label="copiedAsbabun ? 'Asbabun Nuzul berhasil disalin' : 'Salin Asbabun Nuzul'"
                  >
                    <Check v-if="copiedAsbabun" class="h-3.5 w-3.5 text-amber-700 dark:text-amber-300" aria-hidden="true" />
                    <Copy v-else class="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{{ copiedAsbabun ? 'Tersalin' : 'Salin' }}</span>
                  </button>
                </div>
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
              <BookOpen class="mx-auto h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
              <h3 class="text-sm font-bold text-foreground">Tidak Ada Riwayat Khusus</h3>
              <p class="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Ayat {{ verseKey }} tidak memiliki riwayat asbabun nuzul khusus yang tercatat tersendiri. Silakan pelajari makna ayat pada tab Tafsir Ulama.
              </p>
            </div>
          </div>
        </main>

        <footer class="border-t border-border p-4 bg-muted/20 flex justify-end">
          <button
            type="button"
            @click="closeDrawer"
            class="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Selesai
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, BookOpen, Copy, Check, RotateCw, AlertCircle } from '@lucide/vue';
import { useQuranApi } from '~/composables/useQuranApi';
import { useSettingsStore } from '~/stores/useSettingsStore';
import { TAFSIR_RESOURCES } from '~/constants/tafsirs';
import { ASBABUN_NUZUL_DATABASE } from '~/constants/asbabunNuzul';
import { stripHtmlTags } from '~/utils/quranValidation';
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
const selectedTafsirId = ref<number>(settings.selectedTafsirId || 1);
const tafsirContent = ref<Tafsir | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const copied = ref(false);
let copyTimeout: ReturnType<typeof setTimeout> | null = null;

const copiedAsbabun = ref(false);
let copyAsbabunTimeout: ReturnType<typeof setTimeout> | null = null;

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
  tafsirContent.value = null;
  try {
    const res = await quranApi.getVerseTafsir(selectedTafsirId.value, props.verseKey);
    tafsirContent.value = res.tafsir;
  } catch (err: any) {
    error.value = err?.message || 'Gagal memuat teks tafsir untuk sumber ini.';
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

const copyTafsirText = async () => {
  if (!tafsirContent.value?.text) return;
  try {
    const cleanText = stripHtmlTags(tafsirContent.value.text);
    const textToCopy = `Tafsir Ayat ${props.verseKey} (${activeTafsirResource.value?.name})\n\n${cleanText}`;
    await navigator.clipboard.writeText(textToCopy);
    copied.value = true;
    if (copyTimeout) clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    // Clipboard fallback
  }
};

const copyAsbabunNuzul = async () => {
  if (!asbabunNuzulData.value) return;
  try {
    const textToCopy = `Asbabun Nuzul Ayat ${props.verseKey}\n${asbabunNuzulData.value.title}\nSumber: ${asbabunNuzulData.value.source}\n\n${asbabunNuzulData.value.narration}`;
    await navigator.clipboard.writeText(textToCopy);
    copiedAsbabun.value = true;
    if (copyAsbabunTimeout) clearTimeout(copyAsbabunTimeout);
    copyAsbabunTimeout = setTimeout(() => {
      copiedAsbabun.value = false;
    }, 2000);
  } catch {
    // Clipboard fallback
  }
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    selectedTafsirId.value = settings.selectedTafsirId || 1;
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
  if (copyTimeout) clearTimeout(copyTimeout);
  if (copyAsbabunTimeout) clearTimeout(copyAsbabunTimeout);
});
</script>
