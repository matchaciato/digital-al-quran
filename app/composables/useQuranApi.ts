import { QURAN_API } from '~/constants/quran';
import {
  validateChapterId,
  validateJuzId,
  validatePageId,
  sanitizeSearchQuery,
  formatTafsirText,
  validateVerseKey
} from '~/utils/quranValidation';
import type {
  Chapter,
  ChapterInfo,
  Verse,
  Recitation,
  AudioFile,
  TafsirResource,
  Tafsir,
  SearchResponse,
  VerseQueryOptions,
  SearchQueryOptions
} from '~/types/quran';

const kemenagSurahCache = new Map<number, Promise<Record<number, string>>>();

async function fetchKemenagSurahTafsir(chapterId: number): Promise<Record<number, string>> {
  if (kemenagSurahCache.has(chapterId)) {
    return kemenagSurahCache.get(chapterId)!;
  }

  const promise = (async () => {
    try {
      const response = await $fetch<{
        code?: number;
        message?: string;
        data?: { tafsir?: Array<{ ayat: number; teks: string }> };
      }>(`https://equran.id/api/v2/tafsir/${chapterId}`, {
        timeout: 8000,
        headers: { Accept: 'application/json' }
      });

      const verseMap: Record<number, string> = {};
      if (response?.data?.tafsir && Array.isArray(response.data.tafsir)) {
        for (const item of response.data.tafsir) {
          if (item?.ayat && item?.teks) {
            verseMap[item.ayat] = item.teks;
          }
        }
      }
      return verseMap;
    } catch (err) {
      kemenagSurahCache.delete(chapterId);
      throw err;
    }
  })();

  kemenagSurahCache.set(chapterId, promise);
  return promise;
}

export function useQuranApi() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.quranApiBaseUrl || QURAN_API.DEFAULT_BASE_URL;

  const fetchApi = async <T>(endpoint: string, queryParams: Record<string, any> = {}): Promise<T> => {
    const cleanParams: Record<string, string> = {};
    for (const [key, val] of Object.entries(queryParams)) {
      if (val !== undefined && val !== null && val !== '') {
        cleanParams[key] = String(val);
      }
    }

    return await $fetch<T>(`${baseUrl}${endpoint}`, {
      query: cleanParams,
      headers: {
        'Accept': 'application/json'
      }
    });
  };

  const getChapters = async (language = QURAN_API.DEFAULT_LANGUAGE): Promise<{ chapters: Chapter[] }> => {
    return fetchApi<{ chapters: Chapter[] }>('/chapters', { language });
  };

  const getChapter = async (chapterId: number, language = QURAN_API.DEFAULT_LANGUAGE): Promise<{ chapter: Chapter }> => {
    const validId = validateChapterId(chapterId);
    return fetchApi<{ chapter: Chapter }>(`/chapters/${validId}`, { language });
  };

  const getChapterInfo = async (chapterId: number, language = QURAN_API.DEFAULT_LANGUAGE): Promise<{ chapter_info: ChapterInfo }> => {
    const validId = validateChapterId(chapterId);
    return fetchApi<{ chapter_info: ChapterInfo }>(`/chapters/${validId}/info`, { language });
  };

  const getVersesByChapter = async (chapterId: number, options: VerseQueryOptions = {}): Promise<{ verses: Verse[]; pagination: any }> => {
    const validId = validateChapterId(chapterId);
    const {
      language = QURAN_API.DEFAULT_LANGUAGE,
      words = true,
      translationIds = [QURAN_API.DEFAULT_TRANSLATION_ID, 131],
      reciterId = QURAN_API.DEFAULT_RECITER_ID,
      page = 1,
      perPage = QURAN_API.DEFAULT_PER_PAGE
    } = options;

    return fetchApi<{ verses: Verse[]; pagination: any }>(`/verses/by_chapter/${validId}`, {
      language,
      words: words ? 'true' : 'false',
      translations: translationIds.join(','),
      audio: reciterId,
      fields: 'text_uthmani,verse_key,verse_number,page_number,juz_number',
      word_fields: 'text_uthmani,location,text_indonesian,audio_url',
      page: Math.max(1, page),
      per_page: Math.min(QURAN_API.MAX_PER_PAGE, Math.max(1, perPage))
    });
  };

  const getVersesByJuz = async (juzId: number, options: VerseQueryOptions = {}): Promise<{ verses: Verse[]; pagination: any }> => {
    const validId = validateJuzId(juzId);
    const {
      language = QURAN_API.DEFAULT_LANGUAGE,
      words = true,
      translationIds = [QURAN_API.DEFAULT_TRANSLATION_ID, 131],
      reciterId = QURAN_API.DEFAULT_RECITER_ID,
      page = 1,
      perPage = QURAN_API.DEFAULT_PER_PAGE
    } = options;

    return fetchApi<{ verses: Verse[]; pagination: any }>(`/verses/by_juz/${validId}`, {
      language,
      words: words ? 'true' : 'false',
      translations: translationIds.join(','),
      audio: reciterId,
      fields: 'text_uthmani,verse_key,verse_number,page_number,juz_number',
      word_fields: 'text_uthmani,location,text_indonesian,audio_url',
      page: Math.max(1, page),
      per_page: Math.min(QURAN_API.MAX_PER_PAGE, Math.max(1, perPage))
    });
  };

  const getVersesByPage = async (pageId: number, options: VerseQueryOptions = {}): Promise<{ verses: Verse[]; pagination: any }> => {
    const validId = validatePageId(pageId);
    const {
      language = QURAN_API.DEFAULT_LANGUAGE,
      words = true,
      translationIds = [QURAN_API.DEFAULT_TRANSLATION_ID, 131],
      reciterId = QURAN_API.DEFAULT_RECITER_ID,
      page = 1,
      perPage = QURAN_API.DEFAULT_PER_PAGE
    } = options;

    return fetchApi<{ verses: Verse[]; pagination: any }>(`/verses/by_page/${validId}`, {
      language,
      words: words ? 'true' : 'false',
      translations: translationIds.join(','),
      audio: reciterId,
      fields: 'text_uthmani,verse_key,verse_number,page_number,juz_number',
      word_fields: 'text_uthmani,location,text_indonesian,audio_url',
      page: Math.max(1, page),
      per_page: Math.min(QURAN_API.MAX_PER_PAGE, Math.max(1, perPage))
    });
  };

  const getRecitations = async (language = QURAN_API.DEFAULT_LANGUAGE): Promise<{ recitations: Recitation[] }> => {
    return fetchApi<{ recitations: Recitation[] }>('/resources/recitations', { language });
  };

  const getChapterRecitation = async (reciterId: number, chapterId: number): Promise<{ audio_file: AudioFile }> => {
    const validChapterId = validateChapterId(chapterId);
    const validReciterId = Math.floor(Number(reciterId));
    return fetchApi<{ audio_file: AudioFile }>(`/chapter_recitations/${validReciterId}/${validChapterId}`);
  };

  const getTafsirs = async (language = QURAN_API.DEFAULT_LANGUAGE): Promise<{ tafsirs: TafsirResource[] }> => {
    return fetchApi<{ tafsirs: TafsirResource[] }>('/resources/tafsirs', { language });
  };

  const getTafsirByChapter = async (tafsirId: number, chapterId: number): Promise<{ tafsirs: Tafsir[] }> => {
    const validChapterId = validateChapterId(chapterId);
    const validTafsirId = Math.floor(Number(tafsirId)) || 1;

    if (validTafsirId === 1 || validTafsirId === 2) {
      try {
        const surahMap = await fetchKemenagSurahTafsir(validChapterId);
        const list: Tafsir[] = Object.entries(surahMap).map(([ayat, teks]) => ({
          id: validTafsirId,
          resource_id: validTafsirId,
          text: formatTafsirText(teks),
          verse_key: `${validChapterId}:${ayat}`,
          resource_name: validTafsirId === 1 ? 'Tafsir Kemenag RI (Tahlili)' : 'Tafsir Ringkas Kemenag (Wajiz)'
        }));
        if (list.length > 0) {
          return { tafsirs: list };
        }
      } catch (err) {
        // Fallback to Quran.com if available
      }
    }

    return fetchApi<{ tafsirs: Tafsir[] }>(`/tafsirs/${validTafsirId}/by_chapter/${validChapterId}`);
  };

  const getVerseTafsir = async (tafsirId: number, verseKey: string): Promise<{ tafsir: Tafsir }> => {
    const { chapterId, verseNumber } = validateVerseKey(verseKey);
    const validTafsirId = Math.floor(Number(tafsirId)) || 1;
    const cleanKey = `${chapterId}:${verseNumber}`;

    if (validTafsirId === 1) {
      try {
        const surahTafsir = await fetchKemenagSurahTafsir(chapterId);
        const text = surahTafsir[verseNumber];
        if (text && text.trim()) {
          return {
            tafsir: {
              id: 1,
              resource_id: 1,
              text: formatTafsirText(text),
              verse_key: cleanKey,
              resource_name: 'Tafsir Kemenag RI (Tahlili)'
            }
          };
        }
      } catch (err) {
        // Fallback to secondary provider
      }

      try {
        const gadingRes = await $fetch<{
          data?: { tafsir?: { id?: { long?: string; short?: string } } };
        }>(`https://api.quran.gading.dev/surah/${chapterId}/${verseNumber}`, {
          timeout: 6000,
          headers: { Accept: 'application/json' }
        });
        const fallbackText = gadingRes?.data?.tafsir?.id?.long || gadingRes?.data?.tafsir?.id?.short;
        if (fallbackText && fallbackText.trim()) {
          return {
            tafsir: {
              id: 1,
              resource_id: 1,
              text: formatTafsirText(fallbackText),
              verse_key: cleanKey,
              resource_name: 'Tafsir Kemenag RI'
            }
          };
        }
      } catch (err) {
        // Continue to throw user-friendly error
      }

      throw new Error(`Teks Tafsir Kemenag RI tidak ditemukan untuk ayat ${cleanKey}.`);
    }

    if (validTafsirId === 2) {
      try {
        const gadingRes = await $fetch<{
          data?: { tafsir?: { id?: { short?: string; long?: string } } };
        }>(`https://api.quran.gading.dev/surah/${chapterId}/${verseNumber}`, {
          timeout: 6000,
          headers: { Accept: 'application/json' }
        });
        const shortText = gadingRes?.data?.tafsir?.id?.short;
        if (shortText && shortText.trim()) {
          return {
            tafsir: {
              id: 2,
              resource_id: 2,
              text: formatTafsirText(shortText),
              verse_key: cleanKey,
              resource_name: 'Tafsir Ringkas Kemenag (Wajiz)'
            }
          };
        }
      } catch (err) {
        // Fallback to Tahlili below
      }

      try {
        const surahTafsir = await fetchKemenagSurahTafsir(chapterId);
        const text = surahTafsir[verseNumber];
        if (text && text.trim()) {
          return {
            tafsir: {
              id: 2,
              resource_id: 2,
              text: formatTafsirText(text),
              verse_key: cleanKey,
              resource_name: 'Tafsir Ringkas Kemenag (Wajiz)'
            }
          };
        }
      } catch (err) {
        // Continue to throw user-friendly error
      }

      throw new Error(`Teks Tafsir Ringkas Kemenag tidak ditemukan untuk ayat ${cleanKey}.`);
    }

    try {
      const response = await fetchApi<{ tafsir: any }>(`/tafsirs/${validTafsirId}/by_ayah/${cleanKey}`);
      if (!response?.tafsir || !response.tafsir.text) {
        throw new Error(`Teks tafsir tidak tersedia untuk ayat ${cleanKey}.`);
      }

      return {
        tafsir: {
          id: validTafsirId,
          resource_id: response.tafsir.resource_id || validTafsirId,
          text: formatTafsirText(response.tafsir.text),
          verse_key: cleanKey,
          resource_name: response.tafsir.resource_name || 'Tafsir'
        }
      };
    } catch (err: any) {
      if (err?.message?.includes('tidak tersedia')) {
        throw err;
      }
      throw new Error(`Gagal memuat teks tafsir dari sumber (ID: ${validTafsirId}) untuk ayat ${cleanKey}.`);
    }
  };

  const searchQuran = async (query: string, options: SearchQueryOptions = {}): Promise<SearchResponse> => {
    const sanitized = sanitizeSearchQuery(query);
    if (!sanitized) {
      return { search: { query: '', total_results: 0, current_page: 1, total_pages: 0, results: [] } };
    }

    const { language = QURAN_API.DEFAULT_LANGUAGE, page = 1, size = 20 } = options;
    return fetchApi<SearchResponse>('/search', {
      q: sanitized,
      language,
      page: Math.max(1, page),
      size: Math.min(100, Math.max(1, size))
    });
  };

  return {
    getChapters,
    getChapter,
    getChapterInfo,
    getVersesByChapter,
    getVersesByJuz,
    getVersesByPage,
    getRecitations,
    getChapterRecitation,
    getTafsirs,
    getTafsirByChapter,
    getVerseTafsir,
    searchQuran
  };
}
