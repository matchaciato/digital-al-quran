<template>
  <dialog v-if="isOpen" open>
    <article>
      <header>
        <h3>Tafsir Ayat {{ verseKey }}</h3>
        <button type="button" @click="closeModal">Tutup</button>
      </header>
      <section v-if="isLoading">
        <p>Memuat tafsir...</p>
      </section>
      <section v-else-if="error">
        <p>{{ error }}</p>
      </section>
      <section v-else-if="tafsir">
        <h4>{{ tafsir.resource_name }}</h4>
        <div v-html="tafsir.text"></div>
      </section>
    </article>
  </dialog>
</template>

<script setup lang="ts">
import { useQuranApi } from '~/composables/useQuranApi';
import { useSettingsStore } from '~/stores/useSettingsStore';
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

const tafsir = ref<Tafsir | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const loadTafsir = async () => {
  if (!props.verseKey) return;
  isLoading.value = true;
  error.value = null;
  try {
    const res = await quranApi.getVerseTafsir(settings.selectedTafsirId, props.verseKey);
    tafsir.value = res.tafsir;
  } catch (err: any) {
    error.value = 'Gagal memuat tafsir.';
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadTafsir();
  }
});

const closeModal = () => {
  emit('close');
};
</script>
