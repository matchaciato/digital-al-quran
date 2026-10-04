import { describe, it, expect } from 'vitest';
import { resolveVerseAudioUrl, resolveWordAudioUrl } from '~/utils/audioUrlResolver';

describe('audioUrlResolver Utility', () => {
  it('should return absolute HTTPS URLs as-is', () => {
    const url = 'https://verses.quran.com/Alafasy/mp3/001001.mp3';
    expect(resolveVerseAudioUrl(url, '1:1')).toBe(url);
  });

  it('should prepend https to protocol-relative URLs', () => {
    expect(resolveVerseAudioUrl('//verses.quran.com/audio.mp3', '1:1')).toBe('https://verses.quran.com/audio.mp3');
  });

  it('should construct fallback CDN URL with 3-digit zero padding for reciters', () => {
    const expected = 'https://verses.quran.com/Alafasy/mp3/001001.mp3';
    expect(resolveVerseAudioUrl('', '1:1', 7)).toBe(expected);

    const expectedBaqarah = 'https://verses.quran.com/Husary/mp3/002255.mp3';
    expect(resolveVerseAudioUrl(null, '2:255', 6)).toBe(expectedBaqarah);
  });

  it('should resolve word audio URLs accurately', () => {
    expect(resolveWordAudioUrl('wbw/001_001_001.mp3')).toBe('https://audio.qurancdn.com/wbw/001_001_001.mp3');
    expect(resolveWordAudioUrl('https://custom.com/word.mp3')).toBe('https://custom.com/word.mp3');
    expect(resolveWordAudioUrl('')).toBe('');
  });
});
