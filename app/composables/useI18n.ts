import { useLocalStorage } from '@vueuse/core';

export type AppLocale = 'id' | 'en' | 'ar';

export interface Translations {
  navSurah: string;
  navJuz: string;
  navTopics: string;
  navSearch: string;
  navTadabbur: string;
  settingsTitle: string;
  readingMode: string;
  modeVerse: string;
  modeMushaf: string;
  modeZen: string;
  modeParallel: string;
  play: string;
  pause: string;
  tafsir: string;
  bookmark: string;
  bookmarked: string;
  lastRead: string;
  copy: string;
  copied: string;
  searchPlaceholder: string;
  darkTheme: string;
  lightTheme: string;
  reciterLabel: string;
  fontSizeArabic: string;
  fontSizeTranslation: string;
}

const MESSAGES: Record<AppLocale, Translations> = {
  id: {
    navSurah: 'Surah',
    navJuz: 'Juz',
    navTopics: 'Topik',
    navSearch: 'Pencarian',
    navTadabbur: 'Tadabbur',
    settingsTitle: 'Pengaturan Tampilan',
    readingMode: 'Mode Membaca',
    modeVerse: 'Ayat',
    modeMushaf: 'Mushaf',
    modeZen: 'Zen',
    modeParallel: 'Komparasi',
    play: 'Putar',
    pause: 'Jeda',
    tafsir: 'Tafsir',
    bookmark: 'Tandai',
    bookmarked: 'Ditandai',
    lastRead: 'Terakhir Dibaca',
    copy: 'Salin',
    copied: 'Disalin!',
    searchPlaceholder: 'Cari surah, juz, atau terjemahan ayat...',
    darkTheme: 'Mode Gelap',
    lightTheme: 'Mode Terang',
    reciterLabel: 'Pilihan Qari',
    fontSizeArabic: 'Ukuran Font Arab',
    fontSizeTranslation: 'Ukuran Terjemahan'
  },
  en: {
    navSurah: 'Surahs',
    navJuz: 'Juz',
    navTopics: 'Topics',
    navSearch: 'Search',
    navTadabbur: 'Reflections',
    settingsTitle: 'Display Settings',
    readingMode: 'Reading Mode',
    modeVerse: 'Verse by Verse',
    modeMushaf: 'Mushaf',
    modeZen: 'Zen Focus',
    modeParallel: 'Comparative',
    play: 'Play',
    pause: 'Pause',
    tafsir: 'Exegesis (Tafsir)',
    bookmark: 'Bookmark',
    bookmarked: 'Bookmarked',
    lastRead: 'Last Read',
    copy: 'Copy',
    copied: 'Copied!',
    searchPlaceholder: 'Search surah, juz, or translation...',
    darkTheme: 'Dark Mode',
    lightTheme: 'Light Mode',
    reciterLabel: 'Reciter',
    fontSizeArabic: 'Arabic Font Size',
    fontSizeTranslation: 'Translation Font Size'
  },
  ar: {
    navSurah: 'السور',
    navJuz: 'الأجزاء',
    navTopics: 'المواضيع',
    navSearch: 'البحث',
    navTadabbur: 'التدبر',
    settingsTitle: 'إعدادات العرض',
    readingMode: 'وضع القراءة',
    modeVerse: 'آية بآية',
    modeMushaf: 'المصحف',
    modeZen: 'تركيز زن',
    modeParallel: 'المقارنة',
    play: 'تشغيل',
    pause: 'إيقاف مؤقت',
    tafsir: 'التفسير',
    bookmark: 'حفظ العلامة',
    bookmarked: 'تم الحفظ',
    lastRead: 'آخر قراءة',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    searchPlaceholder: 'ابحث عن سورة، جزء، أو آية...',
    darkTheme: 'الوضع الليلي',
    lightTheme: 'الوضع النهاري',
    reciterLabel: 'القارئ',
    fontSizeArabic: 'حجم الخط العربي',
    fontSizeTranslation: 'حجم الترجمة'
  }
};

const KEY_ALIAS_MAP: Record<string, keyof Translations> = {
  'nav.surah': 'navSurah',
  'nav.juz': 'navJuz',
  'nav.topics': 'navTopics',
  'nav.search': 'navSearch',
  'nav.tadabbur': 'navTadabbur',
  'reader.play': 'play',
  'reader.pause': 'pause',
  'reader.tafsir': 'tafsir',
  'reader.bookmark': 'bookmark',
  'reader.bookmarked': 'bookmarked',
  'reader.copy': 'copy',
  'reader.copied': 'copied',
  'settings.title': 'settingsTitle',
  'settings.mode': 'readingMode'
};

export const useI18n = () => {
  const currentLocale = useLocalStorage<AppLocale>('quran_app_locale', 'id');

  const isRTL = computed(() => currentLocale.value === 'ar');

  const translate = (key: string): string => {
    const localeMsgs = MESSAGES[currentLocale.value] || MESSAGES.id;
    const resolvedKey = KEY_ALIAS_MAP[key] || (key as keyof Translations);
    return (localeMsgs as any)[resolvedKey] || key;
  };

  if (import.meta.client) {
    watch(currentLocale, (locale) => {
      document.documentElement.setAttribute('lang', locale);
      document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    }, { immediate: true });
  }

  const setLocale = (locale: AppLocale) => {
    currentLocale.value = locale;
  };

  return {
    currentLocale,
    isRTL,
    t: translate,
    setLocale
  };
};
