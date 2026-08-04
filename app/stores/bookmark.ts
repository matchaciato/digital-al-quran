import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export interface BookmarkItem {
  verseKey: string;
  chapterId: number;
  verseNumber: number;
  addedAt: number;
  note?: string;
}

export interface LastReadItem {
  chapterId: number;
  verseKey: string;
  verseNumber: number;
  pageNumber: number;
  juzNumber: number;
  updatedAt: number;
}

export const useBookmarkStore = defineStore('bookmark', () => {
  const bookmarks = useLocalStorage<BookmarkItem[]>('quran_bookmarks', []);
  const lastRead = useLocalStorage<LastReadItem | null>('quran_last_read', null);

  const addBookmark = (chapterId: number, verseNumber: number, verseKey: string, note?: string) => {
    const existingIndex = bookmarks.value.findIndex(b => b.verseKey === verseKey);
    const item: BookmarkItem = {
      verseKey,
      chapterId: Math.floor(Number(chapterId)),
      verseNumber: Math.floor(Number(verseNumber)),
      addedAt: Date.now(),
      note: note ? String(note).trim().slice(0, 200) : undefined
    };

    if (existingIndex >= 0) {
      bookmarks.value[existingIndex] = item;
    } else {
      bookmarks.value.unshift(item);
    }
  };

  const removeBookmark = (verseKey: string) => {
    bookmarks.value = bookmarks.value.filter(b => b.verseKey !== verseKey);
  };

  const isBookmarked = (verseKey: string): boolean => {
    return bookmarks.value.some(b => b.verseKey === verseKey);
  };

  const setLastRead = (chapterId: number, verseNumber: number, verseKey: string, pageNumber = 1, juzNumber = 1) => {
    lastRead.value = {
      chapterId: Math.floor(Number(chapterId)),
      verseKey: String(verseKey).trim(),
      verseNumber: Math.floor(Number(verseNumber)),
      pageNumber: Math.floor(Number(pageNumber)),
      juzNumber: Math.floor(Number(juzNumber)),
      updatedAt: Date.now()
    };
  };

  const clearLastRead = () => {
    lastRead.value = null;
  };

  return {
    bookmarks,
    lastRead,
    addBookmark,
    removeBookmark,
    isBookmarked,
    setLastRead,
    clearLastRead
  };
});
