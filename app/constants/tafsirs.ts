export interface TafsirOption {
  id: number;
  name: string;
  author: string;
  language: 'id' | 'en' | 'ar';
  description: string;
}

export const TAFSIR_RESOURCES: TafsirOption[] = [
  {
    id: 168,
    name: 'Tafsir Kemenag RI',
    author: 'Kementerian Agama Republik Indonesia',
    language: 'id',
    description: 'Tafsir standar resmi Kemenag RI yang komprehensif, kontekstual, dan mudah dipahami.'
  },
  {
    id: 164,
    name: 'Tafsir Jalalayn',
    author: 'Jalaluddin al-Mahalli & Jalaluddin as-Suyuti',
    language: 'id',
    description: 'Tafsir klasik mukhtashar yang sangat terkenal di dunia Islam dan pesantren.'
  },
  {
    id: 169,
    name: 'Tafsir Ibn Kathir',
    author: 'Al-Hafizh Ibnu Katsir',
    language: 'id',
    description: 'Tafsir bil-ma\'tsur rujukan utama yang menafsirkan Al-Qur\'an dengan ayat dan hadits shahih.'
  },
  {
    id: 171,
    name: 'Tafsir As-Sa\'di',
    author: 'Syaikh Abdurrahman bin Nashir as-Sa\'di',
    language: 'id',
    description: 'Taisir al-Karim ar-Rahman, tafsir kontemporer yang menekankan faedah praktis dan tauhid.'
  },
  {
    id: 166,
    name: 'Tafsir Maududi (Tafhim)',
    author: 'Abul A\'la Maududi',
    language: 'en',
    description: 'Tafhim al-Qur\'an, tafsir mendalam tentang aspek sosiologis, peradaban, dan pesan dakwah.'
  }
];
