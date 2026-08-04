import { QURAN_API } from '~/constants/quran';
import { validateChapterId, validateJuzId, validatePageId, sanitizeSearchQuery } from '~/utils/quranValidation';
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
      translationIds = [QURAN_API.DEFAULT_TRANSLATION_ID],
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
      word_fields: 'text_uthmani,location,text_indonesian',
      page: Math.max(1, page),
      per_page: Math.min(QURAN_API.MAX_PER_PAGE, Math.max(1, perPage))
    });
  };

  const getVersesByJuz = async (juzId: number, options: VerseQueryOptions = {}): Promise<{ verses: Verse[]; pagination: any }> => {
    const validId = validateJuzId(juzId);
    const {
      language = QURAN_API.DEFAULT_LANGUAGE,
      words = true,
      translationIds = [QURAN_API.DEFAULT_TRANSLATION_ID],
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
      word_fields: 'text_uthmani,location,text_indonesian',
      page: Math.max(1, page),
      per_page: Math.min(QURAN_API.MAX_PER_PAGE, Math.max(1, perPage))
    });
  };

  const getVersesByPage = async (pageId: number, options: VerseQueryOptions = {}): Promise<{ verses: Verse[]; pagination: any }> => {
    const validId = validatePageId(pageId);
    const {
      language = QURAN_API.DEFAULT_LANGUAGE,
      words = true,
      translationIds = [QURAN_API.DEFAULT_TRANSLATION_ID],
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
      word_fields: 'text_uthmani,location,text_indonesian',
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
    const validTafsirId = Math.floor(Number(tafsirId));
    return fetchApi<{ tafsirs: Tafsir[] }>(`/tafsirs/${validTafsirId}/by_chapter/${validChapterId}`);
  };

  const getVerseTafsir = async (tafsirId: number, verseKey: string): Promise<{ tafsir: Tafsir }> => {
    const validTafsirId = Math.floor(Number(tafsirId));
    const cleanKey = String(verseKey).trim();
    return fetchApi<{ tafsir: Tafsir }>(`/tafsirs/${validTafsirId}/by_verse/${cleanKey}`);
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
