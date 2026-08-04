<template>
  <section v-if="pendingChapter || pendingVerses">
    <p>Memuat data surah...</p>
  </section>

  <section v-else-if="errorChapter || errorVerses || !chapterData?.chapter">
    <p>Gagal memuat data surah.</p>
    <NuxtLink to="/">Kembali ke Beranda</NuxtLink>
  </section>

  <article v-else>
    <header>
      <h2>Surah {{ chapterData.chapter.id }}. {{ chapterData.chapter.name_simple }} ({{ chapterData.chapter.name_arabic }})</h2>
      <p>{{ chapterData.chapter.translated_name.name }} • {{ chapterData.chapter.revelation_place }} • {{ chapterData.chapter.verses_count }} Ayat</p>
      
      <button type="button" @click="handlePlayFullSurah">
        {{ isPlayingFullSurah ? 'Pause Murottal Surah' : 'Putar Murottal Surah' }}
      </button>
    </header>

    <div v-if="chapterData.chapter.bismillah_pre">
      <p dir="rtl" style="font-size: 28px; text-align: center;">
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </p>
    </div>

    <section>
      <QuranVerseItem
        v-for="verse in versesData?.verses"
        :key="verse.id"
        :verse="verse"
        :surah-name="chapterData.chapter.name_simple"
        :chapter-id="chapterData.chapter.id"
        @open-tafsir="handleOpenTafsir"
      />
    </section>

    <QuranTafsirModal
      :is-open="isTafsirOpen"
      :verse-key="selectedTafsirVerseKey"
      @close="isTafsirOpen = false"
    />
  </article>
</template>

<script setup lang="ts">
import { useQuranApi } from '~/composables/useQuranApi';
import { useSettingsStore } from '~/stores/useSettingsStore';
import { useAudioStore } from '~/stores/useAudioStore';
import { useAudioPlayer } from '~/composables/useAudioPlayer';

const route = useRoute();
const chapterId = computed(() => Number(route.params.id) || 1);

const quranApi = useQuranApi();
const settings = useSettingsStore();
const audioStore = useAudioStore();
const audioPlayer = useAudioPlayer();

const isTafsirOpen = ref(false);
const selectedTafsirVerseKey = ref('');

const { data: chapterData, pending: pendingChapter, error: errorChapter } = await useAsyncData(
  `chapter-${chapterId.value}`,
  () => quranApi.getChapter(chapterId.value)
);

const { data: versesData, pending: pendingVerses, error: errorVerses } = await useAsyncData(
  `verses-${chapterId.value}-${settings.selectedReciterId}`,
  () => quranApi.getVersesByChapter(chapterId.value, {
    reciterId: settings.selectedReciterId,
    perPage: 300
  })
);

const isPlayingFullSurah = computed(() => {
  return audioStore.currentChapterId === chapterId.value && audioStore.isPlaying && !audioStore.currentVerseKey;
});

const handlePlayFullSurah = async () => {
  if (isPlayingFullSurah.value) {
    audioPlayer.togglePlayPause();
  } else {
    try {
      const recitationRes = await quranApi.getChapterRecitation(settings.selectedReciterId, chapterId.value);
      if (recitationRes?.audio_file?.audio_url) {
        audioStore.setAudioSource(
          recitationRes.audio_file.audio_url,
          chapterId.value,
          versesData.value?.verses || [],
          recitationRes.audio_file
        );
        audioPlayer.playVerse(recitationRes.audio_file.audio_url, `${chapterId.value}:1`);
      }
    } catch (err) {
      console.error(err);
    }
  }
};

const handleOpenTafsir = (verseKey: string) => {
  selectedTafsirVerseKey.value = verseKey;
  isTafsirOpen.value = true;
};
</script>
