import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export interface TadabburFolder {
  id: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface TadabburNote {
  id: string;
  verseKey: string;
  surahName: string;
  surahId: number;
  note: string;
  folderId: string;
  createdAt: number;
  updatedAt: number;
}

export const useTadabburStore = defineStore('tadabbur', () => {
  const folders = useLocalStorage<TadabburFolder[]>('quran_tadabbur_folders', [
    { id: 'f-1', name: 'Ayat Penyejuk Hati', description: 'Koleksi ayat pembawa ketenangan dan doa saat gelisah', createdAt: Date.now() },
    { id: 'f-2', name: 'Bahan Kajian & Khutbah', description: 'Catatan tadabbur mendalam untuk materi dakwah', createdAt: Date.now() },
    { id: 'f-3', name: 'Target Hafalan', description: 'Daftar ayat dan catatan mutasyabihat', createdAt: Date.now() }
  ]);

  const notes = useLocalStorage<TadabburNote[]>('quran_tadabbur_notes', [
    {
      id: 'n-1',
      verseKey: '94:5',
      surahName: 'Al-Insyirah',
      surahId: 94,
      note: 'Allah mengulang dua kali: sesungguhnya bersama kesulitan selalu ada kemudahan. Kesulitan sifatnya tunggal (al-\'usr), sedangkan kemudahan bersifat jamak/berlipat (yusran).',
      folderId: 'f-1',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  ]);

  const addFolder = (name: string, description: string = '') => {
    if (!name.trim()) return;
    const newFolder: TadabburFolder = {
      id: `f-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      createdAt: Date.now()
    };
    folders.value.push(newFolder);
  };

  const removeFolder = (id: string) => {
    folders.value = folders.value.filter(f => f.id !== id);
    notes.value = notes.value.map(n => n.folderId === id ? { ...n, folderId: 'f-1' } : n);
  };

  const addNote = (data: { verseKey: string; surahName: string; surahId: number; note: string; folderId?: string }) => {
    if (!data.note.trim()) return;
    const newNote: TadabburNote = {
      id: `n-${Date.now()}`,
      verseKey: data.verseKey,
      surahName: data.surahName,
      surahId: data.surahId,
      note: data.note.trim(),
      folderId: data.folderId || folders.value[0]?.id || 'f-1',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    notes.value.unshift(newNote);
  };

  const updateNote = (id: string, noteText: string, folderId?: string) => {
    const idx = notes.value.findIndex(n => n.id === id);
    if (idx !== -1 && notes.value[idx]) {
      notes.value[idx].note = noteText;
      if (folderId) notes.value[idx].folderId = folderId;
      notes.value[idx].updatedAt = Date.now();
    }
  };

  const removeNote = (id: string) => {
    notes.value = notes.value.filter(n => n.id !== id);
  };

  const exportMarkdown = (): string => {
    let md = `# Jurnal Tadabbur Al-Qur'an\n*Diekspor pada: ${new Date().toLocaleString('id-ID')}*\n\n---\n\n`;
    for (const folder of folders.value) {
      const folderNotes = notes.value.filter(n => n.folderId === folder.id);
      if (folderNotes.length === 0) continue;
      md += `## ${folder.name}\n${folder.description ? `*${folder.description}*\n\n` : ''}`;
      for (const item of folderNotes) {
        md += `### QS. ${item.surahName} (${item.verseKey})\n`;
        md += `${item.note}\n\n`;
        md += `*Dicatat pada: ${new Date(item.createdAt).toLocaleDateString('id-ID')}*\n\n---\n\n`;
      }
    }
    return md;
  };

  return {
    folders,
    notes,
    addFolder,
    removeFolder,
    addNote,
    updateNote,
    removeNote,
    exportMarkdown
  };
});
