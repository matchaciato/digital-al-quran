const RECITER_PATH_MAP: Record<number, string> = {
  7: 'Alafasy/mp3',
  6: 'Husary/mp3',
  12: 'Husary_Mujawwad/mp3',
  2: 'Abdul_Basit_Murattal/mp3',
  1: 'Abdul_Basit_Mujawwad/mp3',
  8: 'Minshawi/Murattal/mp3',
  9: 'Minshawi/Mujawwad/mp3',
  3: 'Ghamadi/mp3',
  4: 'Shatri/mp3',
  5: 'Rifai/mp3',
  10: 'Shuraym/mp3',
  11: 'Sudais/mp3',
  13: 'Maher_AlMuaiqly/mp3',
  14: 'Dussary/mp3',
  15: 'Ali_Jaber/mp3'
};

export function resolveVerseAudioUrl(
  rawUrl: string | undefined | null,
  verseKey: string,
  reciterId: number = 7
): string {
  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim()) {
    const cleanUrl = rawUrl.trim();
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    if (cleanUrl.startsWith('//')) {
      return `https:${cleanUrl}`;
    }
    const path = cleanUrl.startsWith('/') ? cleanUrl.substring(1) : cleanUrl;
    return `https://verses.quran.com/${path}`;
  }

  if (verseKey && verseKey.includes(':')) {
    const [surahStr, ayahStr] = verseKey.split(':');
    const surahNum = Number(surahStr);
    const ayahNum = Number(ayahStr);

    if (!isNaN(surahNum) && !isNaN(ayahNum)) {
      const paddedSurah = String(surahNum).padStart(3, '0');
      const paddedAyah = String(ayahNum).padStart(3, '0');
      const reciterFolder = RECITER_PATH_MAP[reciterId] || 'Alafasy/mp3';
      return `https://verses.quran.com/${reciterFolder}/${paddedSurah}${paddedAyah}.mp3`;
    }
  }

  return '';
}

export function resolveWordAudioUrl(rawUrl: string | undefined | null): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const clean = rawUrl.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  if (clean.startsWith('//')) {
    return `https:${clean}`;
  }
  const path = clean.startsWith('/') ? clean.substring(1) : clean;
  return `https://audio.qurancdn.com/${path}`;
}
