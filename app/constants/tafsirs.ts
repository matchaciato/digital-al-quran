export interface TafsirOption {
  id: number;
  name: string;
  author: string;
  language: 'id' | 'en' | 'ar';
  description: string;
  sourceType: 'kemenag_tahlili' | 'kemenag_wajiz' | 'qurancom';
}

export const TAFSIR_RESOURCES: TafsirOption[] = [
  {
    id: 1,
    name: 'Tafsir Kemenag (Tahlili)',
    author: 'Kementerian Agama Republik Indonesia',
    language: 'id',
    description: 'Tafsir resmi Kemenag RI versi lengkap (Tahlili) dengan analisis bahasa, asbabun nuzul, munasabah, dan penafsiran mendalam.',
    sourceType: 'kemenag_tahlili'
  },
  {
    id: 2,
    name: 'Tafsir Ringkas Kemenag (Wajiz)',
    author: 'Kementerian Agama Republik Indonesia',
    language: 'id',
    description: 'Tafsir ringkas resmi Kemenag RI (Al-Wajiz) yang padat, jelas, dan mudah dipahami dalam sekali baca.',
    sourceType: 'kemenag_wajiz'
  },
  {
    id: 16,
    name: 'Tafsir Al-Muyassar (Arab)',
    author: 'Majma\' Malik Fahd li Thiba\'at al-Mushaf',
    language: 'ar',
    description: 'Tafsir mukhtashar berbahasa Arab yang disusun oleh para pakar tafsir dengan ungkapan yang fasih dan mudah.',
    sourceType: 'qurancom'
  },
  {
    id: 91,
    name: 'Tafsir As-Sa\'di (Arab)',
    author: 'Syaikh Abdurrahman bin Nashir as-Sa\'di',
    language: 'ar',
    description: 'Taisir al-Karim ar-Rahman fi Tafsir Kalam al-Mannan, tafsir berbahasa Arab kontemporer yang sarat faedah iman dan tauhid.',
    sourceType: 'qurancom'
  },
  {
    id: 14,
    name: 'Tafsir Ibn Kathir (Arab)',
    author: 'Al-Hafizh Ibnu Katsir',
    language: 'ar',
    description: 'Tafsir al-Qur\'an al-\'Azhim teks asli bahasa Arab, karya rujukan tafsir bil ma\'tsur paling masyhur di dunia Islam.',
    sourceType: 'qurancom'
  },
  {
    id: 169,
    name: 'Tafsir Ibn Kathir (English)',
    author: 'Hafiz Ibn Kathir (Abridged)',
    language: 'en',
    description: 'Terjemahan ringkas bahasa Inggris dari rujukan klasik Tafsir Ibnu Katsir.',
    sourceType: 'qurancom'
  },
  {
    id: 168,
    name: 'Ma\'arif al-Qur\'an (English)',
    author: 'Mufti Muhammad Shafi',
    language: 'en',
    description: 'Tafsir komprehensif bahasa Inggris yang mendalam membahas hukum, akhlak, dan hikmah ayat-ayat Al-Qur\'an.',
    sourceType: 'qurancom'
  }
];

