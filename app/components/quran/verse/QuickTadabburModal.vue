<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-tadabbur-title"
      class="relative w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-2xl transition-all"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-border pb-3.5">
        <div class="flex items-center gap-2">
          <BookMarked class="h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <h2 id="quick-tadabbur-title" class="text-base font-bold text-foreground">Jurnal Tadabbur Ayat</h2>
            <p class="text-xs text-muted-foreground">
              QS. {{ surahName }} (Ayat {{ verseKey }})
            </p>
          </div>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          aria-label="Tutup jendela tadabbur"
          class="rounded-md border border-input p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <!-- Form Body -->
      <div class="mt-4 space-y-4">
        <!-- Folder Selection -->
        <div>
          <label for="quick-folder-select" class="block text-xs font-semibold text-foreground mb-1">
            Pilih Kategori / Folder
          </label>
          <select
            id="quick-folder-select"
            v-model="selectedFolderId"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option
              v-for="folder in tadabburStore.folders"
              :key="folder.id"
              :value="folder.id"
            >
              {{ folder.name }}
            </option>
          </select>
        </div>

        <!-- Note Textarea -->
        <div>
          <label for="quick-note-textarea" class="block text-xs font-semibold text-foreground mb-1">
            Catatan Renungan & Hikmah
          </label>
          <textarea
            id="quick-note-textarea"
            v-model="noteText"
            rows="5"
            placeholder="Tuliskan hikmah, pelajaran, atau doa yang terinspirasi dari ayat ini..."
            class="w-full rounded-md border border-input bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
          ></textarea>
        </div>

        <!-- Feedback message -->
        <p v-if="successMsg" class="text-xs text-emerald-500 font-medium animate-pulse">
          {{ successMsg }}
        </p>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-2 border-t border-border/40">
          <div>
            <button
              v-if="existingNote"
              type="button"
              @click="handleDeleteNote"
              class="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 class="h-3.5 w-3.5" />
              <span>Hapus Catatan</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="$emit('close')"
              class="inline-flex h-9 items-center rounded-md border border-input px-3 text-xs font-medium text-muted-foreground hover:bg-muted"
            >
              Batal
            </button>
            <button
              type="button"
              :disabled="!noteText.trim()"
              @click="handleSaveNote"
              class="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              <Check class="h-3.5 w-3.5" aria-hidden="true" />
              <span>{{ existingNote ? 'Perbarui refleksi' : 'Simpan refleksi' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookMarked, X, Check, Trash2 } from '@lucide/vue';
import { useTadabburStore } from '~/stores/useTadabburStore';

const props = defineProps<{
  isOpen: boolean;
  verseKey: string;
  surahName: string;
  surahId: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const tadabburStore = useTadabburStore();

const noteText = ref('');
const selectedFolderId = ref('f-1');
const successMsg = ref('');

const existingNote = computed(() => {
  return tadabburStore.notes.find(n => n.verseKey === props.verseKey);
});

watch(
  () => [props.isOpen, props.verseKey],
  () => {
    if (props.isOpen) {
      successMsg.value = '';
      if (existingNote.value) {
        noteText.value = existingNote.value.note;
        selectedFolderId.value = existingNote.value.folderId || 'f-1';
      } else {
        noteText.value = '';
        selectedFolderId.value = tadabburStore.folders[0]?.id || 'f-1';
      }
    }
  },
  { immediate: true }
);

const handleSaveNote = () => {
  if (!noteText.value.trim()) return;

  if (existingNote.value) {
    tadabburStore.updateNote(existingNote.value.id, noteText.value.trim(), selectedFolderId.value);
    successMsg.value = 'Catatan berhasil diperbarui!';
  } else {
    tadabburStore.addNote({
      verseKey: props.verseKey,
      surahName: props.surahName,
      surahId: props.surahId,
      note: noteText.value.trim(),
      folderId: selectedFolderId.value
    });
    successMsg.value = 'Catatan berhasil disimpan ke jurnal!';
  }

  setTimeout(() => {
    emit('close');
  }, 700);
};

const handleDeleteNote = () => {
  if (existingNote.value) {
    tadabburStore.removeNote(existingNote.value.id);
    noteText.value = '';
    emit('close');
  }
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
