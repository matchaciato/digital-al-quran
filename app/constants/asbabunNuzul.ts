export interface AsbabunNuzulItem {
  verseKey: string;
  surahName: string;
  title: string;
  source: string;
  narration: string;
}

export const ASBABUN_NUZUL_DATABASE: Record<string, AsbabunNuzulItem> = {
  '1:1': {
    verseKey: '1:1',
    surahName: 'Al-Fatihah',
    title: 'Keutamaan Basmalah dan Pembuka Kitabullah',
    source: 'Tafsir Ibn Kathir & As-Suyuti (Lubab an-Nuqul)',
    narration: 'Surah Al-Fatihah turun sebagai Ummul Kitab (Induk Kitab). Rasulullah SAW bersabda bahwa tidak sah shalat seseorang tanpa membacanya. Basmalah mengawali setiap perkara baik untuk mengundang keberkahan Ilahi.'
  },
  '2:183': {
    verseKey: '2:183',
    surahName: 'Al-Baqarah',
    title: 'Kewajiban Ibadah Puasa Ramadhan',
    source: 'HR. Ahmad, Abu Dawud, dan Lubab an-Nuqul fi Asbab an-Nuzul',
    narration: 'Ketika Rasulullah SAW berhijrah ke Madinah, kaum Muslimin awalnya berpuasa tiga hari setiap bulan dan puasa Asyura (10 Muharram). Kemudian Allah SWT menurunkan ayat ini untuk mewajibkan puasa sebulan penuh di bulan Ramadhan sebagai sarana meraih ketakwaan tertinggi.'
  },
  '2:255': {
    verseKey: '2:255',
    surahName: 'Al-Baqarah',
    title: 'Ayat Kursi: Keagungan Tauhid dan Kekuasaan Mutlak Allah',
    source: 'HR. Muslim (dari Ubay bin Ka\'ab)',
    narration: 'Rasulullah SAW bertanya kepada Ubay bin Ka\'ab tentang ayat apakah yang paling agung dalam Al-Qur\'an. Ubay menjawab: "Allahu laa ilaaha illa Huwal Hayyul Qayyum (Ayat Kursi)". Rasulullah menepuk dadanya seraya bersabda: "Semoga engkau berbahagia dengan ilmumu, wahai Abu Mundzir."'
  },
  '3:190': {
    verseKey: '3:190',
    surahName: 'Ali \'Imran',
    title: 'Penciptaan Langit, Bumi dan Renungan Ulul Albab',
    source: 'HR. Ibnu Hibban dari Aisyah RA',
    narration: 'Aisyah RA menceritakan bahwa Rasulullah SAW menangis semalaman saat shalat malam hingga janggut dan tanah tempat sujudnya basah. Ketika Bilal bertanya mengapa beliau menangis, Rasulullah bersabda: "Celakalah orang yang membaca ayat ini namun tidak merenungkannya."'
  },
  '18:1': {
    verseKey: '18:1',
    surahName: 'Al-Kahf',
    title: 'Pertanyaan Kaum Quraisy tentang Ashabul Kahfi, Dzulqarnain & Ruh',
    source: 'Sirah Ibnu Hisyam & Lubab an-Nuqul',
    narration: 'Kaum kafir Quraisy mengutus utusan kepada rabi Yahudi di Yatsrib untuk menguji kenabian Muhammad. Mereka disuruh menanyakan 3 hal: tentang pemuda yang tidur di gua (Ashabul Kahfi), tentang pengembara yang mencapai timur dan barat (Dzulqarnain), dan tentang hakikat Ruh. Maka Allah menurunkan Surah Al-Kahf sebagai jawaban gamblang.'
  },
  '93:1': {
    verseKey: '93:1',
    surahName: 'Ad-Duha',
    title: 'Terhentinya Wahyu dan Hiburan bagi Rasulullah SAW',
    source: 'HR. Bukhari dan Muslim dari Jundub bin Sufyan',
    narration: 'Wahyu sempat terhenti selama beberapa waktu sehingga kaum musyrikin mengejek dengan berkata: "Tuhannya telah meninggalkan Muhammad dan membencinya." Maka Allah menurunkan Surah Ad-Duha untuk menegaskan bahwa Allah tidak pernah meninggalkan kekasih-Nya.'
  },
  '96:1': {
    verseKey: '96:1',
    surahName: 'Al-\'Alaq',
    title: 'Wahyu Pertama di Gua Hira',
    source: 'HR. Bukhari dan Muslim dari Aisyah RA',
    narration: 'Malaikat Jibril mendatangi Nabi Muhammad SAW saat ber-tahannuts di Gua Hira dan berkata: "Iqra\' (Bacalah!)". Nabi menjawab: "Maa ana bi qari\' (Aku tidak bisa membaca)." Jibril memeluk beliau hingga tiga kali kemudian membacakan lima ayat pertama Surah Al-\'Alaq.'
  },
  '108:1': {
    verseKey: '108:1',
    surahName: 'Al-Kautsar',
    title: 'Ejekan Al-Ashi bin Wail dan Telaga Al-Kautsar',
    source: 'HR. Ibnu Abi Hatim dari Ibnu Abbas RA',
    narration: 'Ketika putra Rasulullah SAW (Al-Qasim dan Abdullah) wafat saat masih kecil, orang-orang musyrik Quraisy mencemooh beliau dengan sebutan "Abtar" (terputus keturunannya). Maka Allah menurunkan Surah Al-Kautsar untuk menghibur Nabi bahwa beliau diberi nikmat melimpah (Al-Kautsar) dan justru para pembenci beliaulah yang terputus.'
  },
  '112:1': {
    verseKey: '112:1',
    surahName: 'Al-Ikhlas',
    title: 'Pertanyaan Kaum Musyrikin tentang Silsilah Allah',
    source: 'HR. At-Tirmidzi dan Ahmad dari Ubay bin Ka\'ab',
    narration: 'Orang-orang musyrik berkata kepada Rasulullah SAW: "Wahai Muhammad, sebutkan silsilah dan sifat Tuhanmu kepada kami! Apakah Dia terbuat dari emas atau perak?" Maka Allah menurunkan Surah Al-Ikhlas menegaskan keesaan mutlak-Nya yang tidak beranak dan tidak diperanakkan.'
  }
};
