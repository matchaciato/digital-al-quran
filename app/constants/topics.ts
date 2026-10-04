export interface ThematicAyah {
  verseKey: string;
  surahName: string;
  surahId: number;
  arabicText: string;
  translationText: string;
  contextNote?: string;
}

export interface ThematicTopic {
  slug: string;
  title: string;
  arabicTitle: string;
  category: string;
  summary: string;
  verses: ThematicAyah[];
}

export const THEMATIC_TOPICS: ThematicTopic[] = [
  {
    slug: 'kisah-para-nabi',
    title: 'Kisah Keteladanan Para Nabi & Rasul',
    arabicTitle: 'قَصَصُ الأَنْبِيَاءِ وَالرُّسُلِ',
    category: 'Sejarah & Keteladanan',
    summary: 'Kumpulan ayat-ayat inspiratif tentang perjuangan, ketabahan, dan mukjizat para Nabi dan Rasul Allah.',
    verses: [
      {
        verseKey: '21:87',
        surahName: 'Al-Anbiya',
        surahId: 21,
        arabicText: 'وَذَا النُّونِ إِذ ذَّهَبَ مُغَاضِبًا فَظَنَّ أَن لَّن نَّقْدِرَ عَلَيْهِ فَنَادَىٰ فِي الظُّلُمَاتِ أَن لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
        translationText: 'Dan (ingatlah kisah) Dzun Nun (Yunus), ketika dia pergi dalam keadaan marah, lalu dia menyangka bahwa Kami tidak akan menyulitkannya, maka dia berdoa dalam kegelapan yang berlapis-lapis: "Tidak ada tuhan selain Engkau, Mahasuci Engkau, sesungguhnya aku termasuk orang-orang yang zhalim."',
        contextNote: 'Doa Nabi Yunus AS di dalam perut ikan paus sebagai teladan taubat dan pengakuan kelemahan diri.'
      },
      {
        verseKey: '12:86',
        surahName: 'Yusuf',
        surahId: 12,
        arabicText: 'قَالَ إِنَّمَا أَشْكُو بَثِّي وَحُزْنِي إِلَى اللَّهِ وَأَعْلَمُ مِنَ اللَّهِ مَا لَا تَعْلَمُونَ',
        translationText: 'Dia (Ya\'qub) menjawab: "Hanya kepada Allah aku mengadukan kesusahan dan kesedihanku, dan aku mengetahui dari Allah apa yang tidak kamu ketahui."',
        contextNote: 'Keteguhan hati Nabi Ya\'qub AS saat menghadapi cobaan perpisahan dengan Nabi Yusuf AS.'
      },
      {
        verseKey: '20:25',
        surahName: 'Taha',
        surahId: 20,
        arabicText: 'قَالَ رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي',
        translationText: 'Dia (Musa) berkata: "Ya Tuhanku, lapangkanlah dadaku, dan mudahkanlah untukku urusanku, dan lepaskanlah kekakuan dari lidahku, agar mereka mengerti perkataanku."',
        contextNote: 'Permohonan Nabi Musa AS sebelum menghadap Fir\'aun untuk berdakwah.'
      }
    ]
  },
  {
    slug: 'kosmologi-dan-sains',
    title: 'Kosmologi, Alam Semesta & Fenomena Sains',
    arabicTitle: 'الْكَوْنُ وَالْآيَاتُ الْكَوْنِيَّةُ',
    category: 'Tadabbur Alam',
    summary: 'Ayat-ayat mulia yang mengisyaratkan penciptaan galaksi, pergerakan orbit benda langit, dan siklus hidrologi bumi.',
    verses: [
      {
        verseKey: '21:30',
        surahName: 'Al-Anbiya',
        surahId: 21,
        arabicText: 'أَوَلَمْ يَرَ الَّذِينَ كَفَرُوا أَنَّ السَّمَاوَاتِ وَالْأَرْضَ كَانَتَا رَتْقًا فَفَتَقْنَاهُمَا ۖ وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ ۖ أَفَلَا يُؤْمِنُونَ',
        translationText: 'Dan apakah orang-orang kafir tidak mengetahui bahwa langit dan bumi dahulunya menyatu, kemudian Kami pisahkan antara keduanya; dan Kami jadikan segala sesuatu yang hidup berasal dari air; maka mengapa mereka tidak beriman?',
        contextNote: 'Isyarat fenomena dentuman besar (Big Bang) dan pentingnya air sebagai elemen dasar kehidupan.'
      },
      {
        verseKey: '36:40',
        surahName: 'Yasin',
        surahId: 36,
        arabicText: 'لَا الشَّمْسُ يَنبَغِي لَهَا أَن تُدْرِكَ الْقَمَرَ وَلَا اللَّيْلُ سَابِقُ النَّهَارِ ۚ وَكُلٌّ فِي فَلَكٍ يَسْبَحُونَ',
        translationText: 'Tidaklah mungkin bagi matahari mengejar bulan dan malam pun tidak dapat mendahului siang. Masing-masing beredar pada garis edarnya.',
        contextNote: 'Presisi mekanika orbit tata surya yang teratur sempurna.'
      },
      {
        verseKey: '51:47',
        surahName: 'Az-Zariyat',
        surahId: 51,
        arabicText: 'وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ',
        translationText: 'Dan langit itu Kami bangun dengan kekuasaan (Kami) dan sesungguhnya Kami benar-benar meluaskannya.',
        contextNote: 'Isyarat ekspansi alam semesta (expanding universe).'
      }
    ]
  },
  {
    slug: 'hukum-dan-muamalah',
    title: 'Hukum, Etika & Muamalah Sosial',
    arabicTitle: 'الأَحْكَامُ وَالأَخْلَاقُ وَالمُعَامَلَاتُ',
    category: 'Etika & Syariah',
    summary: 'Pedoman berkehidupan sosial, menegakkan keadilan, integritas amanah, dan larangan transaksi bathil.',
    verses: [
      {
        verseKey: '4:58',
        surahName: 'An-Nisa',
        surahId: 4,
        arabicText: 'إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ ۚ إِنَّ اللَّهَ نِعِمَّا يَعِظُكُم بِهِ ۗ إِنَّ اللَّهَ كَانَ سَمِيعًا بَصِيرًا',
        translationText: 'Sungguh, Allah menyuruhmu menyampaikan amanat kepada yang berhak menerimanya, dan apabila kamu menetapkan hukum di antara manusia hendaklah kamu menetapkannya dengan adil. Sungguh, Allah sebaik-baik yang memberi pengajaran kepadamu. Sungguh, Allah Maha Mendengar, Maha Melihat.',
        contextNote: 'Pilar utama keadilan hukum dan integritas memegang amanah.'
      },
      {
        verseKey: '2:275',
        surahName: 'Al-Baqarah',
        surahId: 2,
        arabicText: 'الَّذِينَ يَأْكُلُونَ الرِّبَا لَا يَقُومُونَ إِلَّا كَمَا يَقُومُ الَّذِي يَتَخَبَّطُهُ الشَّيْطَانُ مِنَ الْمَسِّ ۚ ذَٰلِكَ بِأَنَّهُمْ قَالُوا إِنَّمَا الْبَيْعُ مِثْلُ الرِّبَا ۗ وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا',
        translationText: 'Orang-orang yang memakan riba tidak dapat berdiri melainkan seperti berdirinya orang yang kemasukan setan karena gila. Yang demikian itu karena mereka berkata bahwa jual beli itu sama dengan riba. Padahal Allah telah menghalalkan jual beli dan mengharamkan riba.',
        contextNote: 'Prinsip keadilan ekonomi Islam yang memberantas eksploitasi riba.'
      }
    ]
  },
  {
    slug: 'kumpulan-doa-pilihan',
    title: 'Kumpulan Doa Robbana & Doa Pilihan',
    arabicTitle: 'أَدْعِيَةُ رَبَّنَا وَأَدْعِيَةُ الأَنْبِيَاءِ',
    category: 'Munajat & Dzikir',
    summary: 'Rangkaian doa-doa mustajab dari Al-Qur\'an untuk memohon ampunan, keteguhan hati, dan kebaikan dunia-akhirat.',
    verses: [
      {
        verseKey: '2:201',
        surahName: 'Al-Baqarah',
        surahId: 2,
        arabicText: 'وَمِنْهُم مَّن يَقُولُ رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        translationText: 'Dan di antara mereka ada yang berdoa: "Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka."',
        contextNote: 'Doa Sapujagad yang paling sering dibaca Rasulullah SAW.'
      },
      {
        verseKey: '3:8',
        surahName: 'Ali \'Imran',
        surahId: 3,
        arabicText: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ',
        translationText: '(Mereka berdoa): "Ya Tuhan kami, janganlah Engkau condongkan hati kami kepada kesesatan setelah Engkau berikan petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi-Mu; sesungguhnya Engkau Maha Pemberi."',
        contextNote: 'Doa memohon ketetapan iman dan istiqamah dalam kebenaran.'
      },
      {
        verseKey: '25:74',
        surahName: 'Al-Furqan',
        surahId: 25,
        arabicText: 'وَالَّذِينَ يَقُولُونَ رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
        translationText: 'Dan orang-orang yang berkata: "Ya Tuhan kami, anugerahkanlah kepada kami pasangan kami dan keturunan kami sebagai penyejuk hati (kami), dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa."',
        contextNote: 'Doa keluarga sakinah dan keturunan shalih.'
      }
    ]
  },
  {
    slug: 'hari-kiamat-dan-eskatologi',
    title: 'Hari Kiamat, Kebangkitan & Eskatologi',
    arabicTitle: 'يَوْمُ القِيَامَةِ وَالْبَعْثُ وَالْجَزَاءُ',
    category: 'Akidah & Akhirat',
    summary: 'Peringatan mengenai kepastian hari akhir, hisab amal, dan janji balasan surga bagi orang-orang beriman.',
    verses: [
      {
        verseKey: '99:7',
        surahName: 'Az-Zalzalah',
        surahId: 99,
        arabicText: 'فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ',
        translationText: 'Maka barangsiapa mengerjakan kebaikan seberat zarrah, niscaya dia akan melihat (balasan)nya, dan barangsiapa mengerjakan kejahatan seberat zarrah, niscaya dia akan melihat (balasan)nya.',
        contextNote: 'Prinsip keadilan hisab mutlak tanpa ada amal sekecil apapun yang terlewat.'
      },
      {
        verseKey: '89:27',
        surahName: 'Al-Fajr',
        surahId: 89,
        arabicText: 'يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً فَادْخُلِي فِي عِبَادِي وَادْخُلِي جَنَّتِي',
        translationText: 'Wahai jiwa yang tenang! Kembalilah kepada Tuhanmu dengan hati yang ridha dan diridhai-Nya. Maka masuklah ke dalam golongan hamba-hamba-Ku, dan masuklah ke dalam surga-Ku.',
        contextNote: 'Panggilan mulia bagi jiwa-jiwa beriman yang tenang di akhirat.'
      }
    ]
  }
];
