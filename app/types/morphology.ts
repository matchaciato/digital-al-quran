export interface WordMorphology {
  wordId: number;
  location: string;
  arabic: string;
  transliteration: string;
  translation: string;
  root: string;
  rootArabic: string;
  partOfSpeech: 'noun' | 'verb' | 'particle' | 'pronoun' | 'adjective' | string;
  partOfSpeechLabel: string;
  wazan?: string;
  lemma: string;
  occurrencesCount: number;
  relatedAyahs: Array<{
    verseKey: string;
    surahName: string;
    surahId: number;
    text: string;
    translation: string;
  }>;
}

export interface TriliteralRootInfo {
  root: string;
  rootLetters: string[];
  meanings: string[];
  totalOccurrences: number;
  nounsCount: number;
  verbsCount: number;
  surahsCovered: number;
}
