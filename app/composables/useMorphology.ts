import type { WordMorphology } from '~/types/morphology';
import type { Word } from '~/types/quran';
import { stripHtmlTags } from '~/utils/quranValidation';
import { resolveWordAudioUrl } from '~/utils/audioUrlResolver';

const ROOTS_DICTIONARY: Record<string, Partial<WordMorphology>> = {
  'اسم': {
    root: 'س م و',
    rootArabic: 'س م و',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Isim (Kata Benda - Nama/Tanda)',
    wazan: 'فِعْل',
    lemma: 'اِسْم',
    occurrencesCount: 39,
  },
  'الله': {
    root: 'ا ل ه',
    rootArabic: 'أ ل هـ',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Lafdzul Jalalah (Isim Ma\'rifah)',
    wazan: 'فِعَال',
    lemma: 'اللّٰه',
    occurrencesCount: 2699,
  },
  'الرحمن': {
    root: 'ر ح م',
    rootArabic: 'ر ح م',
    partOfSpeech: 'adjective',
    partOfSpeechLabel: 'Shifat Musyabbahah (Maha Pengasih)',
    wazan: 'فَعْلَان',
    lemma: 'رَحْمٰن',
    occurrencesCount: 57,
  },
  'الرحيم': {
    root: 'ر ح م',
    rootArabic: 'ر ح م',
    partOfSpeech: 'adjective',
    partOfSpeechLabel: 'Shifat Musyabbahah (Maha Penyayang)',
    wazan: 'فَعِيل',
    lemma: 'رَحِيْم',
    occurrencesCount: 115,
  },
  'الحمد': {
    root: 'ح م د',
    rootArabic: 'ح م د',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Mashdar (Segala Pujian)',
    wazan: 'فَعْل',
    lemma: 'حَمْد',
    occurrencesCount: 68,
  },
  'رب': {
    root: 'ر ب ب',
    rootArabic: 'ر ب ب',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Isim Shifat (Tuhan Pemelihara)',
    wazan: 'فَعْل',
    lemma: 'رَبّ',
    occurrencesCount: 975,
  },
  'العالمين': {
    root: 'ع ل م',
    rootArabic: 'ع ل م',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Isim Jamak Mudzakkar Salim (Semesta Alam)',
    wazan: 'فَاعِلِين',
    lemma: 'عَالَم',
    occurrencesCount: 73,
  },
  'مالك': {
    root: 'م ل ك',
    rootArabic: 'م ل ك',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Isim Fa\'il (Pemilik / Raja)',
    wazan: 'فَاعِل',
    lemma: 'مَالِك',
    occurrencesCount: 206,
  },
  'يوم': {
    root: 'ي و م',
    rootArabic: 'ي و م',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Zharf Zaman / Isim (Hari / Waktu)',
    wazan: 'فَعْل',
    lemma: 'يَوْم',
    occurrencesCount: 393,
  },
  'الدين': {
    root: 'د ي ن',
    rootArabic: 'د ي ن',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Isim (Pembalasan / Agama)',
    wazan: 'فِعْل',
    lemma: 'دِيْن',
    occurrencesCount: 92,
  },
  'نعبد': {
    root: 'ع ب د',
    rootArabic: 'ع ب د',
    partOfSpeech: 'verb',
    partOfSpeechLabel: 'Fi\'il Mudhari\' (Kami Menyembah)',
    wazan: 'نَفْعُلُ (Mujarrad)',
    lemma: 'عَبَدَ',
    occurrencesCount: 275,
  },
  'نستعين': {
    root: 'ع و ن',
    rootArabic: 'ع و ن',
    partOfSpeech: 'verb',
    partOfSpeechLabel: 'Fi\'il Mudhari\' Istif\'al (Kami Memohon Pertolongan)',
    wazan: 'نَسْتَفْعِلُ',
    lemma: 'اِسْتَعَانَ',
    occurrencesCount: 11,
  },
  'اهدنا': {
    root: 'ه د ي',
    rootArabic: 'هـ د ي',
    partOfSpeech: 'verb',
    partOfSpeechLabel: 'Fi\'il Amar / Doa (Tunjukilah Kami)',
    wazan: 'اِفْعِلْ',
    lemma: 'هَدَى',
    occurrencesCount: 316,
  },
  'الصراط': {
    root: 'ص ر ط',
    rootArabic: 'ص ر ط',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Isim (Jalan Lurus)',
    wazan: 'فِعَال',
    lemma: 'صِرَاط',
    occurrencesCount: 45,
  },
  'المستقيم': {
    root: 'ق و م',
    rootArabic: 'ق و م',
    partOfSpeech: 'adjective',
    partOfSpeechLabel: 'Isim Fa\'il Istif\'al (Yang Lurus / Teguh)',
    wazan: 'مُسْتَفْعِل',
    lemma: 'اِسْتَقَامَ',
    occurrencesCount: 37,
  },
  'كتاب': {
    root: 'ك ت ب',
    rootArabic: 'ك ت ب',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Isim (Kitab / Tulisan Ketetapan)',
    wazan: 'فِعَال',
    lemma: 'كِتَاب',
    occurrencesCount: 261,
  },
  'يؤمنون': {
    root: 'ا م ن',
    rootArabic: 'أ م ن',
    partOfSpeech: 'verb',
    partOfSpeechLabel: 'Fi\'il Mudhari\' (Mereka Beriman)',
    wazan: 'يُفْعِلُونَ',
    lemma: 'آمَنَ',
    occurrencesCount: 879,
  },
  'خلق': {
    root: 'خ ل ق',
    rootArabic: 'خ ل ق',
    partOfSpeech: 'verb',
    partOfSpeechLabel: 'Fi\'il Madhi (Menciptakan)',
    wazan: 'فَعَلَ',
    lemma: 'خَلَقَ',
    occurrencesCount: 261,
  },
  'قال': {
    root: 'ق و ل',
    rootArabic: 'ق و ل',
    partOfSpeech: 'verb',
    partOfSpeechLabel: 'Fi\'il Madhi (Berkata)',
    wazan: 'فَعَلَ',
    lemma: 'قَالَ',
    occurrencesCount: 1722,
  },
  'قل': {
    root: 'ق و ل',
    rootArabic: 'ق و ل',
    partOfSpeech: 'verb',
    partOfSpeechLabel: 'Fi\'il Amar (Katakanlah)',
    wazan: 'فُلْ',
    lemma: 'قَالَ',
    occurrencesCount: 332,
  },
  'علم': {
    root: 'ع ل م',
    rootArabic: 'ع ل م',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Mashdar / Isim (Ilmu Pengetahuan)',
    wazan: 'فِعْل',
    lemma: 'عِلْم',
    occurrencesCount: 105,
  },
  'يعلم': {
    root: 'ع ل م',
    rootArabic: 'ع ل م',
    partOfSpeech: 'verb',
    partOfSpeechLabel: 'Fi\'il Mudhari\' (Mengetahui)',
    wazan: 'يَفْعَلُ',
    lemma: 'عَلِمَ',
    occurrencesCount: 382,
  },
  'نزل': {
    root: 'ن ز ل',
    rootArabic: 'ن ز ل',
    partOfSpeech: 'verb',
    partOfSpeechLabel: 'Fi\'il Madhi (Menurunkan)',
    wazan: 'فَعَّلَ',
    lemma: 'نَزَّلَ',
    occurrencesCount: 293,
  },
  'الصالحات': {
    root: 'ص ل ح',
    rootArabic: 'ص ل ح',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Isim Jamak Muannats (Amal Kebaikan)',
    wazan: 'فَاعِلَات',
    lemma: 'صَالِحَة',
    occurrencesCount: 62,
  },
  'غفور': {
    root: 'غ ف ر',
    rootArabic: 'غ ف ر',
    partOfSpeech: 'adjective',
    partOfSpeechLabel: 'Shighah Mubalaghah (Maha Pengampun)',
    wazan: 'فَعُول',
    lemma: 'غَفُور',
    occurrencesCount: 91,
  },
  'حكيم': {
    root: 'ح ك م',
    rootArabic: 'ح ك م',
    partOfSpeech: 'adjective',
    partOfSpeechLabel: 'Shifat Musyabbahah (Maha Bijaksana)',
    wazan: 'فَعِيل',
    lemma: 'حَكِيم',
    occurrencesCount: 97,
  },
  'عليم': {
    root: 'ع ل م',
    rootArabic: 'ع ل م',
    partOfSpeech: 'adjective',
    partOfSpeechLabel: 'Shifat Musyabbahah (Maha Mengetahui)',
    wazan: 'فَعِيل',
    lemma: 'عَلِيم',
    occurrencesCount: 157,
  },
  'قدير': {
    root: 'ق د ر',
    rootArabic: 'ق د ر',
    partOfSpeech: 'adjective',
    partOfSpeechLabel: 'Shifat Musyabbahah (Maha Kuasa)',
    wazan: 'فَعِيل',
    lemma: 'قَدِير',
    occurrencesCount: 45,
  },
  'سميع': {
    root: 'س م ع',
    rootArabic: 'س م ع',
    partOfSpeech: 'adjective',
    partOfSpeechLabel: 'Shifat Musyabbahah (Maha Mendengar)',
    wazan: 'فَعِيل',
    lemma: 'سَمِيع',
    occurrencesCount: 47,
  },
  'بصير': {
    root: 'ب ص ر',
    rootArabic: 'ب ص ر',
    partOfSpeech: 'adjective',
    partOfSpeechLabel: 'Shifat Musyabbahah (Maha Melihat)',
    wazan: 'فَعِيل',
    lemma: 'بَصِير',
    occurrencesCount: 51,
  },
  'صبر': {
    root: 'ص ب ر',
    rootArabic: 'ص ب ر',
    partOfSpeech: 'noun',
    partOfSpeechLabel: 'Mashdar (Kesabaran)',
    wazan: 'فَعْل',
    lemma: 'صَبْر',
    occurrencesCount: 103,
  }
};

function cleanArabicWord(word: string): string {
  return word
    .replace(/[ًٌٍَُِّْٰۡ]/g, '')
    .replace(/^[وفلب]/, '')
    .trim();
}

export function useMorphology() {
  const getWordMorphology = (word: Word, verseKey: string): WordMorphology => {
    const rawArabic = word.text_uthmani || '';
    const cleaned = cleanArabicWord(rawArabic);
    const translation = word.text_indonesian || word.translation?.text || '';
    const transliteration = word.transliteration?.text || '';

    const matched = ROOTS_DICTIONARY[cleaned] || ROOTS_DICTIONARY[rawArabic] || null;

    if (matched) {
      return {
        wordId: word.id,
        location: `${verseKey}:${word.position}`,
        arabic: rawArabic,
        transliteration: stripHtmlTags(transliteration),
        translation: stripHtmlTags(translation),
        root: matched.root || 'ع ل م',
        rootArabic: matched.rootArabic || 'ع ل م',
        partOfSpeech: matched.partOfSpeech || 'noun',
        partOfSpeechLabel: matched.partOfSpeechLabel || 'Isim (Kata Benda)',
        wazan: matched.wazan || 'فَعْل',
        lemma: matched.lemma || cleaned,
        occurrencesCount: matched.occurrencesCount || 25,
        relatedAyahs: [
          { verseKey: '1:1', surahName: 'Al-Fatihah', surahId: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.' },
          { verseKey: '2:255', surahName: 'Al-Baqarah', surahId: 2, text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', translation: 'Allah, tidak ada tuhan selain Dia, Yang Maha Hidup, Yang terus-menerus mengurus makhluk-Nya.' },
          { verseKey: '112:1', surahName: 'Al-Ikhlas', surahId: 112, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translation: 'Katakanlah: Dialah Allah, Yang Maha Esa.' }
        ]
      };
    }

    const estimatedRoot = cleaned.length >= 3 
      ? `${cleaned[0]} ${cleaned[Math.floor(cleaned.length / 2)]} ${cleaned[cleaned.length - 1]}`
      : 'ك ت ب';

    return {
      wordId: word.id,
      location: `${verseKey}:${word.position}`,
      arabic: rawArabic,
      transliteration: stripHtmlTags(transliteration) || 'Kalimah',
      translation: stripHtmlTags(translation) || 'Leksikal',
      root: estimatedRoot,
      rootArabic: estimatedRoot,
      partOfSpeech: 'noun',
      partOfSpeechLabel: 'Kalimah Mubarokah (Leksikal Al-Qur\'an)',
      wazan: 'فَعَلَ',
      lemma: cleaned,
      occurrencesCount: 18,
      relatedAyahs: [
        { verseKey: verseKey, surahName: 'Al-Quran', surahId: Number(verseKey.split(':')[0]) || 1, text: rawArabic, translation: stripHtmlTags(translation) }
      ]
    };
  };

  const playWordAudio = (audioUrl: string | null) => {
    if (!audioUrl) return;
    const fullUrl = resolveWordAudioUrl(audioUrl);
    if (!fullUrl) return;
    const audio = new Audio(fullUrl);
    audio.play().catch(e => console.warn('Audio word playback prevented or failed:', e));
  };

  return {
    getWordMorphology,
    playWordAudio
  };
}
