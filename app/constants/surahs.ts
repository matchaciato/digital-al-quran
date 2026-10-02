export interface SurahMeta {
  id: number;
  name: string;
  arabic: string;
  totalVerses: number;
  meaning: string;
}

export const ALL_SURAHS: SurahMeta[] = [
  { id: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', totalVerses: 7, meaning: 'Pembukaan' },
  { id: 2, name: 'Al-Baqarah', arabic: 'البقرة', totalVerses: 286, meaning: 'Sapi Betina' },
  { id: 3, name: "Ali 'Imran", arabic: 'آل عمران', totalVerses: 200, meaning: 'Keluarga Imran' },
  { id: 4, name: "An-Nisa'", arabic: 'النساء', totalVerses: 176, meaning: 'Wanita' },
  { id: 5, name: "Al-Ma'idah", arabic: 'المائدة', totalVerses: 120, meaning: 'Jamuan Hidangan' },
  { id: 6, name: "Al-An'am", arabic: 'الأنعام', totalVerses: 165, meaning: 'Binatang Ternak' },
  { id: 7, name: "Al-A'raf", arabic: 'الأعراف', totalVerses: 206, meaning: 'Tempat Tertinggi' },
  { id: 8, name: 'Al-Anfal', arabic: 'الأنفال', totalVerses: 75, meaning: 'Rampasan Perang' },
  { id: 9, name: 'At-Taubah', arabic: 'التوبة', totalVerses: 129, meaning: 'Pengampunan' },
  { id: 10, name: 'Yunus', arabic: 'يونس', totalVerses: 109, meaning: 'Nabi Yunus' },
  { id: 11, name: 'Hud', arabic: 'هود', totalVerses: 123, meaning: 'Nabi Hud' },
  { id: 12, name: 'Yusuf', arabic: 'يوسف', totalVerses: 111, meaning: 'Nabi Yusuf' },
  { id: 13, name: "Ar-Ra'd", arabic: 'الرعد', totalVerses: 43, meaning: 'Guruh' },
  { id: 14, name: 'Ibrahim', arabic: 'إبراهيم', totalVerses: 52, meaning: 'Nabi Ibrahim' },
  { id: 15, name: 'Al-Hijr', arabic: 'الحجر', totalVerses: 99, meaning: 'Gunung Al Hijr' },
  { id: 16, name: 'An-Nahl', arabic: 'النحل', totalVerses: 128, meaning: 'Lebah' },
  { id: 17, name: 'Al-Isra', arabic: 'الإسراء', totalVerses: 111, meaning: 'Perjalanan Malam' },
  { id: 18, name: 'Al-Kahf', arabic: 'الكهف', totalVerses: 110, meaning: 'Gua' },
  { id: 19, name: 'Maryam', arabic: 'مريم', totalVerses: 98, meaning: 'Siti Maryam' },
  { id: 20, name: 'Taha', arabic: 'طه', totalVerses: 135, meaning: 'Thaahaa' },
  { id: 21, name: 'Al-Anbiya', arabic: 'الأنبياء', totalVerses: 112, meaning: 'Nabi-Nabi' },
  { id: 22, name: 'Al-Hajj', arabic: 'الحج', totalVerses: 78, meaning: 'Haji' },
  { id: 23, name: "Al-Mu'minun", arabic: 'المؤمنون', totalVerses: 118, meaning: 'Orang-Orang Mukmin' },
  { id: 24, name: 'An-Nur', arabic: 'النور', totalVerses: 64, meaning: 'Cahaya' },
  { id: 25, name: 'Al-Furqan', arabic: 'الفرقان', totalVerses: 77, meaning: 'Pembeda' },
  { id: 26, name: "Asy-Syu'ara", arabic: 'الشعراء', totalVerses: 227, meaning: 'Penyair' },
  { id: 27, name: 'An-Naml', arabic: 'النمل', totalVerses: 93, meaning: 'Semut' },
  { id: 28, name: 'Al-Qasas', arabic: 'القصص', totalVerses: 88, meaning: 'Kisah-Kisah' },
  { id: 29, name: "Al-'Ankabut", arabic: 'العنكبوت', totalVerses: 69, meaning: 'Laba-Laba' },
  { id: 30, name: 'Ar-Rum', arabic: 'الروم', totalVerses: 60, meaning: 'Bangsa Romawi' },
  { id: 31, name: 'Luqman', arabic: 'لقمان', totalVerses: 34, meaning: 'Keluarga Luqman' },
  { id: 32, name: 'As-Sajdah', arabic: 'السجدة', totalVerses: 30, meaning: 'Sujud' },
  { id: 33, name: 'Al-Ahzab', arabic: 'الأحزاب', totalVerses: 73, meaning: 'Golongan yang Bersekutu' },
  { id: 34, name: "Saba'", arabic: 'سبإ', totalVerses: 54, meaning: 'Kaum Saba' },
  { id: 35, name: 'Fatir', arabic: 'فاطر', totalVerses: 45, meaning: 'Pencipta' },
  { id: 36, name: 'Yasin', arabic: 'يس', totalVerses: 83, meaning: 'Yaa Siin' },
  { id: 37, name: 'As-Saffat', arabic: 'الصافات', totalVerses: 182, meaning: 'Barisan-Barisan' },
  { id: 38, name: 'Sad', arabic: 'ص', totalVerses: 88, meaning: 'Shaad' },
  { id: 39, name: 'Az-Zumar', arabic: 'الزمر', totalVerses: 75, meaning: 'Rombongan-Rombongan' },
  { id: 40, name: 'Ghafir', arabic: 'غافر', totalVerses: 85, meaning: 'Maha Pengampun' },
  { id: 41, name: 'Fussilat', arabic: 'فصلت', totalVerses: 54, meaning: 'Yang Dijelaskan' },
  { id: 42, name: 'Asy-Syura', arabic: 'الشورى', totalVerses: 53, meaning: 'Musyawarah' },
  { id: 43, name: 'Az-Zukhruf', arabic: 'الزخرف', totalVerses: 89, meaning: 'Perhiasan' },
  { id: 44, name: 'Ad-Dukhan', arabic: 'الدخان', totalVerses: 59, meaning: 'Kabut' },
  { id: 45, name: 'Al-Jasiyah', arabic: 'الجاثية', totalVerses: 37, meaning: 'Yang Berlutut' },
  { id: 46, name: 'Al-Ahqaf', arabic: 'الأحقاف', totalVerses: 35, meaning: 'Bukit-Bukit Pasir' },
  { id: 47, name: 'Muhammad', arabic: 'محمد', totalVerses: 38, meaning: 'Nabi Muhammad' },
  { id: 48, name: 'Al-Fath', arabic: 'الفتح', totalVerses: 29, meaning: 'Kemenangan' },
  { id: 49, name: 'Al-Hujurat', arabic: 'الحجرات', totalVerses: 18, meaning: 'Kamar-Kamar' },
  { id: 50, name: 'Qaf', arabic: 'ق', totalVerses: 45, meaning: 'Qaaf' },
  { id: 51, name: 'Az-Zariyat', arabic: 'الذاريات', totalVerses: 60, meaning: 'Angin yang Menerbangkan' },
  { id: 52, name: 'At-Tur', arabic: 'الطور', totalVerses: 49, meaning: 'Bukit' },
  { id: 53, name: 'An-Najm', arabic: 'النجم', totalVerses: 62, meaning: 'Bintang' },
  { id: 54, name: 'Al-Qamar', arabic: 'القمر', totalVerses: 55, meaning: 'Bulan' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن', totalVerses: 78, meaning: 'Maha Pemurah' },
  { id: 56, name: "Al-Waqi'ah", arabic: 'الواقعة', totalVerses: 96, meaning: 'Hari Kiamat' },
  { id: 57, name: 'Al-Hadid', arabic: 'الحديد', totalVerses: 29, meaning: 'Besi' },
  { id: 58, name: 'Al-Mujadilah', arabic: 'المجادلة', totalVerses: 22, meaning: 'Gugatan' },
  { id: 59, name: 'Al-Hasyr', arabic: 'الحشر', totalVerses: 24, meaning: 'Pengusiran' },
  { id: 60, name: 'Al-Mumtahanah', arabic: 'الممتحنة', totalVerses: 13, meaning: 'Wanita yang Diuji' },
  { id: 61, name: 'As-Saff', arabic: 'الصف', totalVerses: 14, meaning: 'Barisan' },
  { id: 62, name: "Al-Jumu'ah", arabic: 'الجمعة', totalVerses: 11, meaning: 'Hari Jumat' },
  { id: 63, name: 'Al-Munafiqun', arabic: 'المنافقون', totalVerses: 11, meaning: 'Orang-Orang Munafik' },
  { id: 64, name: 'At-Taghabun', arabic: 'التغابن', totalVerses: 18, meaning: 'Hari Dinampakkan Kesalahan' },
  { id: 65, name: 'At-Talaq', arabic: 'الطلاق', totalVerses: 12, meaning: 'Perceraian' },
  { id: 66, name: 'At-Tahrim', arabic: 'التحريم', totalVerses: 12, meaning: 'Mengharamkan' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملك', totalVerses: 30, meaning: 'Kerajaan' },
  { id: 68, name: 'Al-Qalam', arabic: 'القلم', totalVerses: 52, meaning: 'Pena' },
  { id: 69, name: 'Al-Haqqah', arabic: 'الحاقة', totalVerses: 52, meaning: 'Hari Kiamat' },
  { id: 70, name: "Al-Ma'arij", arabic: 'المعارج', totalVerses: 44, meaning: 'Tempat Naik' },
  { id: 71, name: 'Nuh', arabic: 'نوح', totalVerses: 28, meaning: 'Nabi Nuh' },
  { id: 72, name: 'Al-Jinn', arabic: 'الجن', totalVerses: 28, meaning: 'Jin' },
  { id: 73, name: 'Al-Muzzammil', arabic: 'المزمل', totalVerses: 20, meaning: 'Orang yang Berselimut' },
  { id: 74, name: 'Al-Muddassir', arabic: 'المدثر', totalVerses: 56, meaning: 'Orang yang Berkemul' },
  { id: 75, name: 'Al-Qiyamah', arabic: 'القيامة', totalVerses: 40, meaning: 'Kiamat' },
  { id: 76, name: 'Al-Insan', arabic: 'الإنسان', totalVerses: 31, meaning: 'Manusia' },
  { id: 77, name: 'Al-Mursalat', arabic: 'المرسلات', totalVerses: 50, meaning: 'Malaikat yang Diutus' },
  { id: 78, name: "An-Naba'", arabic: 'النبإ', totalVerses: 40, meaning: 'Berita Besar' },
  { id: 79, name: "An-Nazi'at", arabic: 'النازعات', totalVerses: 46, meaning: 'Malaikat Pencabut' },
  { id: 80, name: "'Abasa", arabic: 'عبس', totalVerses: 42, meaning: 'Bermuka Masam' },
  { id: 81, name: 'At-Takwir', arabic: 'التكوير', totalVerses: 29, meaning: 'Menggulung' },
  { id: 82, name: 'Al-Infitar', arabic: 'الانفطار', totalVerses: 19, meaning: 'Terbelah' },
  { id: 83, name: 'Al-Mutaffifin', arabic: 'المطففين', totalVerses: 36, meaning: 'Orang-Orang Curang' },
  { id: 84, name: 'Al-Insyiqaq', arabic: 'الانشقاق', totalVerses: 25, meaning: 'Terbelah' },
  { id: 85, name: 'Al-Buruj', arabic: 'البروج', totalVerses: 22, meaning: 'Gugusan Bintang' },
  { id: 86, name: 'At-Tariq', arabic: 'الطارق', totalVerses: 17, meaning: 'Yang Datang di Malam Hari' },
  { id: 87, name: "Al-A'la", arabic: 'الأعلى', totalVerses: 19, meaning: 'Maha Tinggi' },
  { id: 88, name: 'Al-Ghasyiyah', arabic: 'الغاشية', totalVerses: 26, meaning: 'Hari Pembalasan' },
  { id: 89, name: 'Al-Fajr', arabic: 'الفجر', totalVerses: 30, meaning: 'Fajar' },
  { id: 90, name: 'Al-Balad', arabic: 'البلد', totalVerses: 20, meaning: 'Negeri' },
  { id: 91, name: 'Asy-Syams', arabic: 'الشمس', totalVerses: 15, meaning: 'Matahari' },
  { id: 92, name: 'Al-Lail', arabic: 'الليل', totalVerses: 21, meaning: 'Malam' },
  { id: 93, name: 'Ad-Duha', arabic: 'الضحى', totalVerses: 11, meaning: 'Waktu Dhuha' },
  { id: 94, name: 'Al-Insyirah', arabic: 'الشرح', totalVerses: 8, meaning: 'Melapangkan' },
  { id: 95, name: 'At-Tin', arabic: 'التين', totalVerses: 8, meaning: 'Buah Tin' },
  { id: 96, name: "Al-'Alaq", arabic: 'العلق', totalVerses: 19, meaning: 'Segumpal Darah' },
  { id: 97, name: 'Al-Qadr', arabic: 'القدر', totalVerses: 5, meaning: 'Kemuliaan' },
  { id: 98, name: 'Al-Bayyinah', arabic: 'البينة', totalVerses: 8, meaning: 'Bukti Nyata' },
  { id: 99, name: 'Az-Zalzalah', arabic: 'الزلزلة', totalVerses: 8, meaning: 'Keguncangan' },
  { id: 100, name: "Al-'Adiyat", arabic: 'العاديات', totalVerses: 11, meaning: 'Kuda yang Berlari Kencang' },
  { id: 101, name: "Al-Qari'ah", arabic: 'القارعة', totalVerses: 11, meaning: 'Hari Kiamat' },
  { id: 102, name: 'At-Takasur', arabic: 'التكاثر', totalVerses: 8, meaning: 'Bermegah-Megahan' },
  { id: 103, name: "Al-'Asr", arabic: 'العصر', totalVerses: 3, meaning: 'Masa / Waktu' },
  { id: 104, name: 'Al-Humazah', arabic: 'الهمزة', totalVerses: 9, meaning: 'Pengumpat' },
  { id: 105, name: 'Al-Fil', arabic: 'الفيل', totalVerses: 5, meaning: 'Gajah' },
  { id: 106, name: 'Quraisy', arabic: 'قريش', totalVerses: 4, meaning: 'Suku Quraisy' },
  { id: 107, name: "Al-Ma'un", arabic: 'الماعون', totalVerses: 7, meaning: 'Barang-Barang Berguna' },
  { id: 108, name: 'Al-Kausar', arabic: 'الكوثر', totalVerses: 3, meaning: 'Nikmat yang Berlimpah' },
  { id: 109, name: 'Al-Kafirun', arabic: 'الكافرون', totalVerses: 6, meaning: 'Orang-Orang Kafir' },
  { id: 110, name: 'An-Nasr', arabic: 'النصر', totalVerses: 3, meaning: 'Pertolongan' },
  { id: 111, name: 'Al-Lahab', arabic: 'المسد', totalVerses: 5, meaning: 'Gejolak Api' },
  { id: 112, name: 'Al-Ikhlas', arabic: 'الإخلاص', totalVerses: 4, meaning: 'Kemurnian Keesaan Allah' },
  { id: 113, name: 'Al-Falaq', arabic: 'الفلق', totalVerses: 5, meaning: 'Waktu Subuh' },
  { id: 114, name: 'An-Nas', arabic: 'الناس', totalVerses: 6, meaning: 'Manusia' }
];

const surahMap = new Map<number, SurahMeta>(ALL_SURAHS.map(s => [s.id, s]));

/**
 * Returns Surah metadata by its ID (1 - 114) in O(1) time complexity.
 */
export function getSurahById(id: number): SurahMeta | undefined {
  return surahMap.get(id);
}

/**
 * Resolves a Surah's display name from either an ID number or a verse key (e.g. '2:255').
 */
export function getSurahName(idOrVerseKey: number | string, fallback = ''): string {
  if (typeof idOrVerseKey === 'number') {
    return surahMap.get(idOrVerseKey)?.name ?? fallback;
  }
  const chapterId = Number(idOrVerseKey.split(':')[0]);
  return surahMap.get(chapterId)?.name ?? fallback;
}
