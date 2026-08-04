<template>
  <section>
    <h2>Penanda Buku & Riwayat Membaca</h2>

    <article v-if="bookmarkStore.lastRead">
      <h3>Terakhir Dibaca</h3>
      <p>{{ bookmarkStore.lastRead.surahName }} - Ayat {{ bookmarkStore.lastRead.verseKey }}</p>
      <NuxtLink :to="`/surah/${bookmarkStore.lastRead.chapterId}#verse-${bookmarkStore.lastRead.verseKey}`">
        Buka Ayat
      </NuxtLink>
    </article>

    <article>
      <h3>Daftar Bookmark ({{ bookmarkStore.bookmarks.length }})</h3>

      <div v-if="bookmarkStore.bookmarks.length === 0">
        <p>Belum ada ayat yang ditandai.</p>
      </div>

      <ul v-else>
        <li v-for="item in bookmarkStore.bookmarks" :key="item.id">
          <div>
            <strong>{{ item.surahName }}</strong> - Ayat {{ item.verseKey }}
            <p>Ditambahkan pada: {{ formatDate(item.createdAt) }}</p>
          </div>
          <nav>
            <NuxtLink :to="`/surah/${item.chapterId}#verse-${item.verseKey}`">
              Buka Ayat
            </NuxtLink>
            <button type="button" @click="bookmarkStore.removeBookmark(item.id)">
              Hapus
            </button>
          </nav>
        </li>
      </ul>
    </article>
  </section>
</template>

<script setup lang="ts">
import { useBookmarkStore } from '~/stores/useBookmarkStore';

const bookmarkStore = useBookmarkStore();

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
