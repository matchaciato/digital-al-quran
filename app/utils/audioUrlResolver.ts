export function resolveVerseAudioUrl(rawUrl: string | undefined | null, verseKey: string): string {
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
      return `https://verses.quran.com/Alafasy/mp3/${paddedSurah}${paddedAyah}.mp3`;
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
