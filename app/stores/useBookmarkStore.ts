import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';

export interface BookmarkItem {
  id: string;
  chapterId: number;
  verseKey: string;
  verseNumber: number;
  surahName: string;
  createdAt: number;
}

export interface LastReadItem {
  chapterId: number;
  verseKey: string;
  surahName: string;
  updatedAt: number;
}

export const useBookmarkStore = defineStore('bookmark', () => {
  const bookmarks = useLocalStorage<BookmarkItem[]>('quran_bookmarks', []);
  const lastRead = useLocalStorage<LastReadItem | null>('quran_last_read', null);

  const addBookmark = (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => {
    const id = `${item.chapterId}:${item.verseNumber}`;
    if (!bookmarks.value.some(b => b.id === id)) {
      bookmarks.value.push({
        ...item,
        id,
        createdAt: Date.now()
      });
    }
  };

  const removeBookmark = (idOrKey: string) => {
    bookmarks.value = bookmarks.value.filter(b => b.id !== idOrKey && b.verseKey !== idOrKey);
  };

  const isBookmarked = (verseKey: string): boolean => {
    return bookmarks.value.some(b => b.verseKey === verseKey);
  };

  const setLastRead = (item: Omit<LastReadItem, 'updatedAt'>) => {
    lastRead.value = {
      ...item,
      updatedAt: Date.now()
    };
  };

  return {
    bookmarks,
    lastRead,
    addBookmark,
    removeBookmark,
    isBookmarked,
    setLastRead
  };
});
