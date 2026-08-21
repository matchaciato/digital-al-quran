<template>
  <div class="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
    <header class="flex flex-col justify-between gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center">
      <div class="space-y-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-primary">
          Personal Knowledge & Reflection Space
        </span>
        <h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Studio Tadabbur & Penanda Ayat
        </h1>
        <p class="text-xs text-muted-foreground">
          Kelola penanda bacaan, koleksi folder bertema, dan tulis catatan refleksi pribadi Anda.
        </p>
      </div>

      <button
        type="button"
        @click="handleExportMarkdown"
        class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-muted active:scale-95 transition-all"
      >
        <Download class="h-4 w-4 text-primary" />
        Ekspor Jurnal (.md)
      </button>
    </header>

    <section
      v-if="bookmarkStore.lastRead"
      class="flex flex-col justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-6 sm:flex-row sm:items-center"
    >
      <div class="space-y-1">
        <span class="text-xs font-bold uppercase tracking-wider text-primary">
          Terakhir Dibaca
        </span>
        <h3 class="text-lg font-bold text-foreground">
          QS. {{ bookmarkStore.lastRead.surahName }} — Ayat {{ bookmarkStore.lastRead.verseKey }}
        </h3>
        <p class="text-xs text-muted-foreground">
          Lanjutkan tilawah Anda dari titik terakhir.
        </p>
      </div>

      <NuxtLink
        :to="`/surah/${bookmarkStore.lastRead.chapterId}#verse-${bookmarkStore.lastRead.verseKey}`"
        class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 active:scale-95 transition-all"
      >
        Lanjutkan Membaca &rarr;
      </NuxtLink>
    </section>

    <div class="flex items-center justify-between border-b border-border/60 pb-3">
      <div class="inline-flex rounded-lg border border-border bg-muted/40 p-1">
        <button
          type="button"
          @click="activeTab = 'bookmarks'"
          :class="[
            activeTab === 'bookmarks'
              ? 'bg-card text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          ]"
          class="rounded-md px-3.5 py-1.5 text-xs transition-all"
        >
          Penanda Ayat ({{ bookmarkStore.bookmarks.length }})
        </button>
        <button
          type="button"
          @click="activeTab = 'tadabbur'"
          :class="[
            activeTab === 'tadabbur'
              ? 'bg-card text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          ]"
          class="rounded-md px-3.5 py-1.5 text-xs transition-all"
        >
          Jurnal Refleksi ({{ tadabburStore.notes.length }})
        </button>
        <button
          type="button"
          @click="activeTab = 'folders'"
          :class="[
            activeTab === 'folders'
              ? 'bg-card text-foreground shadow-xs font-semibold'
              : 'text-muted-foreground hover:text-foreground'
          ]"
          class="rounded-md px-3.5 py-1.5 text-xs transition-all"
        >
          Folder Koleksi ({{ tadabburStore.folders.length }})
        </button>
      </div>
    </div>

    <section v-if="activeTab === 'bookmarks'" class="space-y-4">
      <div v-if="bookmarkStore.bookmarks.length === 0" class="rounded-xl border border-dashed border-border p-12 text-center space-y-2">
        <span class="text-3xl">🔖</span>
        <h3 class="text-sm font-bold text-foreground">Belum Ada Penanda Ayat</h3>
        <p class="text-xs text-muted-foreground max-w-sm mx-auto">
          Klik tombol "Tandai" pada ayat mana pun saat membaca untuk menyimpannya di sini.
        </p>
      </div>

      <div v-else class="grid gap-3 sm:grid-cols-2">
        <article
          v-for="item in bookmarkStore.bookmarks"
          :key="item.id"
          class="flex items-center justify-between rounded-xl border border-border/70 bg-card p-4 transition-all hover:border-primary/40"
        >
          <div class="space-y-1">
            <span class="rounded bg-muted px-2 py-0.5 text-xs font-bold text-foreground">
              QS. {{ item.surahName }} ({{ item.verseKey }})
            </span>
            <p class="text-[11px] text-muted-foreground">
              Ditambahkan: {{ formatDate(item.createdAt) }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <NuxtLink
              :to="`/surah/${item.chapterId}#verse-${item.verseKey}`"
              class="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-muted"
            >
              Buka
            </NuxtLink>
            <button
              type="button"
              @click="bookmarkStore.removeBookmark(item.id)"
              class="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Hapus penanda"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </article>
      </div>
    </section>

    <section v-else-if="activeTab === 'tadabbur'" class="space-y-6">
      <div class="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-primary">
          Tulis Refleksi / Catatan Tadabbur Baru
        </h3>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <input
            type="text"
            v-model="newVerseKey"
            placeholder="Ayat (misal: 94:5)"
            class="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
          <input
            type="text"
            v-model="newSurahName"
            placeholder="Nama Surah (misal: Al-Insyirah)"
            class="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
          <select
            v-model="newFolderId"
            class="col-span-2 sm:col-span-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
          >
            <option v-for="f in tadabburStore.folders" :key="f.id" :value="f.id">
              {{ f.name }}
            </option>
          </select>
        </div>

        <textarea
          v-model="newNoteText"
          rows="3"
          placeholder="Tuliskan hikmah, pelajaran, atau tadabbur yang Anda dapatkan dari ayat ini..."
          class="w-full rounded-lg border border-border bg-background p-3 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />

        <div class="flex justify-end">
          <button
            type="button"
            @click="handleCreateNote"
            :disabled="!newNoteText.trim()"
            class="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50 hover:opacity-90 active:scale-95 transition-all"
          >
            Simpan Catatan Tadabbur
          </button>
        </div>
      </div>

      <div v-if="tadabburStore.notes.length === 0" class="rounded-xl border border-dashed border-border p-12 text-center space-y-2">
        <span class="text-3xl">Catatan</span>
        <h3 class="text-sm font-bold text-foreground">Belum Ada Catatan Tadabbur</h3>
        <p class="text-xs text-muted-foreground">Tuliskan refleksi pertama Anda menggunakan form di atas.</p>
      </div>

      <div v-else class="space-y-4">
        <article
          v-for="note in tadabburStore.notes"
          :key="note.id"
          class="rounded-xl border border-border/70 bg-card p-5 space-y-3 transition-all hover:border-border"
        >
          <div class="flex items-center justify-between border-b border-border/40 pb-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="rounded bg-primary/10 px-2 py-0.5 font-bold text-primary">
                QS. {{ note.surahName }} ({{ note.verseKey }})
              </span>
              <span class="rounded bg-muted px-2 py-0.5 text-muted-foreground text-[11px]">
                {{ getFolderName(note.folderId) }}
              </span>
            </div>

            <button
              type="button"
              @click="tadabburStore.removeNote(note.id)"
              class="text-muted-foreground hover:text-destructive p-1"
              title="Hapus catatan"
            >
              <Trash2 class="h-3.5 w-3.5" />
            </button>
          </div>

          <p class="text-xs text-foreground/90 leading-relaxed select-text whitespace-pre-line">
            {{ note.note }}
          </p>

          <div class="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
            <span>{{ formatDate(note.createdAt) }}</span>
            <NuxtLink
              :to="`/surah/${note.surahId}#verse-${note.verseKey}`"
              class="font-medium text-primary hover:underline"
            >
              Lihat Ayat &rarr;
            </NuxtLink>
          </div>
        </article>
      </div>
    </section>

    <section v-else-if="activeTab === 'folders'" class="space-y-6">
      <div class="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 sm:flex-row sm:items-center">
        <input
          type="text"
          v-model="newFolderName"
          placeholder="Nama folder baru (misal: Doa Sehari-hari)"
          class="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
        />
        <input
          type="text"
          v-model="newFolderDesc"
          placeholder="Deskripsi singkat (opsional)"
          class="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          @click="handleCreateFolder"
          :disabled="!newFolderName.trim()"
          class="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50 hover:opacity-90 active:scale-95 transition-all"
        >
          + Buat Folder
        </button>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="folder in tadabburStore.folders"
          :key="folder.id"
          class="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5 space-y-3"
        >
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-base font-bold text-foreground">{{ folder.name }}</span>
              <button
                v-if="tadabburStore.folders.length > 1"
                type="button"
                @click="tadabburStore.removeFolder(folder.id)"
                class="text-muted-foreground hover:text-destructive p-1"
                title="Hapus folder"
              >
                <Trash2 class="h-3.5 w-3.5" />
              </button>
            </div>
            <p class="text-xs text-muted-foreground leading-relaxed">
              {{ folder.description || 'Tidak ada deskripsi' }}
            </p>
          </div>

          <div class="border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
            {{ countNotesInFolder(folder.id) }} Catatan Refleksi
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Download, Trash2 } from '@lucide/vue';
import { useBookmarkStore } from '~/stores/useBookmarkStore';
import { useTadabburStore } from '~/stores/useTadabburStore';

const bookmarkStore = useBookmarkStore();
const tadabburStore = useTadabburStore();

const activeTab = ref<'bookmarks' | 'tadabbur' | 'folders'>('bookmarks');

const newVerseKey = ref('94:5');
const newSurahName = ref('Al-Insyirah');
const newFolderId = ref(tadabburStore.folders[0]?.id || 'f-1');
const newNoteText = ref('');

const newFolderName = ref('');
const newFolderDesc = ref('');

const getFolderName = (folderId: string): string => {
  const f = tadabburStore.folders.find(item => item.id === folderId);
  return f?.name || 'Umum';
};

const countNotesInFolder = (folderId: string): number => {
  return tadabburStore.notes.filter(n => n.folderId === folderId).length;
};

const handleCreateNote = () => {
  if (!newNoteText.value.trim()) return;
  const surahId = Number(newVerseKey.value.split(':')[0]) || 1;
  tadabburStore.addNote({
    verseKey: newVerseKey.value.trim(),
    surahName: newSurahName.value.trim() || 'Al-Quran',
    surahId,
    note: newNoteText.value,
    folderId: newFolderId.value
  });
  newNoteText.value = '';
};

const handleCreateFolder = () => {
  if (!newFolderName.value.trim()) return;
  tadabburStore.addFolder(newFolderName.value, newFolderDesc.value);
  newFolderName.value = '';
  newFolderDesc.value = '';
};

const handleExportMarkdown = () => {
  const content = tadabburStore.exportMarkdown();
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Jurnal_Tadabbur_AlQuran_${new Date().toISOString().split('T')[0]}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
</script>
