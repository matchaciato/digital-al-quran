export interface TranslatedName {
  language_name: string;
  name: string;
}

export interface Chapter {
  id: number;
  revelation_place: 'makkah' | 'madinah' | string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: TranslatedName;
}

export interface ChapterInfo {
  id: number;
  chapter_id: number;
  language_name: string;
  short_text: string;
  text: string;
  source: string;
}

export interface Translation {
  id: number;
  resource_id: number;
  text: string;
  resource_name?: string;
  language_name?: string;
}

export interface Word {
  id: number;
  position: number;
  audio_url: string | null;
  char_type_name: string;
  text_uthmani?: string;
  text_indonesian?: string;
  page_number: number;
  line_number: number;
  code_v1?: string;
  translation?: {
    text: string;
    language_name: string;
  };
  transliteration?: {
    text: string;
    language_name: string;
  };
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  hizb_number: number;
  rub_elt_faan_number?: number;
  ruku_number: number;
  surah_number?: number;
  page_number: number;
  juz_number: number;
  text_uthmani: string;
  text_uthmani_simple?: string;
  translations?: Translation[];
  words?: Word[];
  audio?: {
    url: string;
    segments?: number[][];
  };
}

export interface Recitation {
  id: number;
  reciter_name: string;
  style: string | null;
  translated_name: TranslatedName;
}

export interface AudioFile {
  id: number;
  chapter_id: number;
  file_size: number;
  format: string;
  audio_url: string;
  duration?: number;
  verse_timings?: Array<{
    verse_key: string;
    timestamp_from: number;
    timestamp_to: number;
    duration: number;
    segments: number[][];
  }>;
}

export interface TafsirResource {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
  translated_name: TranslatedName;
}

export interface Tafsir {
  id: number;
  resource_id: number;
  text: string;
  verse_key: string;
  resource_name?: string;
}

export interface SearchResult {
  verse_key: string;
  verse_id: number;
  text: string;
  highlighted: string | null;
  words: Word[];
  translations: Translation[];
}

export interface SearchPagination {
  per_page: number;
  current_page: number;
  next_page: number | null;
  total_pages: number;
  total_records: number;
}

export interface SearchResponse {
  search: {
    query: string;
    total_results: number;
    current_page: number;
    total_pages: number;
    results: SearchResult[];
  };
}

export interface VerseQueryOptions {
  language?: string;
  words?: boolean;
  translationIds?: number[];
  reciterId?: number;
  page?: number;
  perPage?: number;
}

export interface SearchQueryOptions {
  language?: string;
  page?: number;
  size?: number;
}
