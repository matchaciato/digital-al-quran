import { describe, it, expect } from 'vitest';
import {
  validateChapterId,
  validateJuzId,
  validatePageId,
  validateVerseKey,
  sanitizeSearchQuery,
  stripHtmlTags,
  formatTafsirText
} from '~/utils/quranValidation';

describe('quranValidation Utility', () => {
  describe('validateChapterId', () => {
    it('should validate valid chapter IDs from 1 to 114', () => {
      expect(validateChapterId(1)).toBe(1);
      expect(validateChapterId(114)).toBe(114);
      expect(validateChapterId('18' as any)).toBe(18);
    });

    it('should throw an error for out of boundary chapter IDs', () => {
      expect(() => validateChapterId(0)).toThrow();
      expect(() => validateChapterId(115)).toThrow();
      expect(() => validateChapterId(-5)).toThrow();
      expect(() => validateChapterId(NaN)).toThrow();
    });
  });

  describe('validateJuzId', () => {
    it('should validate valid juz IDs from 1 to 30', () => {
      expect(validateJuzId(1)).toBe(1);
      expect(validateJuzId(30)).toBe(30);
    });

    it('should throw an error for invalid juz IDs', () => {
      expect(() => validateJuzId(0)).toThrow();
      expect(() => validateJuzId(31)).toThrow();
      expect(() => validateJuzId(NaN)).toThrow();
    });
  });

  describe('validatePageId', () => {
    it('should validate valid page IDs from 1 to 604', () => {
      expect(validatePageId(1)).toBe(1);
      expect(validatePageId(604)).toBe(604);
    });

    it('should throw an error for invalid page IDs', () => {
      expect(() => validatePageId(0)).toThrow();
      expect(() => validatePageId(605)).toThrow();
    });
  });

  describe('validateVerseKey', () => {
    it('should parse valid verse keys into chapterId and verseNumber', () => {
      expect(validateVerseKey('1:1')).toEqual({ chapterId: 1, verseNumber: 1 });
      expect(validateVerseKey('2:255')).toEqual({ chapterId: 2, verseNumber: 255 });
      expect(validateVerseKey('114:6')).toEqual({ chapterId: 114, verseNumber: 6 });
    });

    it('should throw an error for invalid verse keys', () => {
      expect(() => validateVerseKey('')).toThrow();
      expect(() => validateVerseKey('invalid')).toThrow();
      expect(() => validateVerseKey('115:1')).toThrow();
      expect(() => validateVerseKey('1:-1')).toThrow();
    });
  });

  describe('sanitizeSearchQuery', () => {
    it('should trim and clamp length to 100', () => {
      expect(sanitizeSearchQuery('  al-fatihah  ')).toBe('al-fatihah');
      const longQuery = 'a'.repeat(150);
      expect(sanitizeSearchQuery(longQuery).length).toBe(100);
    });

    it('should return empty string for non-string input', () => {
      expect(sanitizeSearchQuery(null as any)).toBe('');
      expect(sanitizeSearchQuery(undefined as any)).toBe('');
    });
  });

  describe('stripHtmlTags', () => {
    it('should remove HTML tags, <sup> tags, and normalize whitespace', () => {
      const input = '<p>Bismillah <sup foot_note="1">1</sup> <strong>ir-Rahman</strong></p>';
      expect(stripHtmlTags(input)).toBe('Bismillah ir-Rahman');
    });
  });

  describe('formatTafsirText', () => {
    it('should split plain text into semantic HTML paragraphs', () => {
      const raw = 'Paragraf satu.\n\nParagraf dua.';
      const formatted = formatTafsirText(raw);
      expect(formatted).toContain('<p class="mb-4 leading-relaxed">Paragraf satu.</p>');
      expect(formatted).toContain('<p class="mb-4 leading-relaxed">Paragraf dua.</p>');
    });

    it('should preserve existing safe HTML markup', () => {
      const html = '<div class="content"><p>Sudah berupa HTML.</p></div>';
      expect(formatTafsirText(html)).toBe(html);
    });

    it('should sanitize dangerous script tags', () => {
      const malicious = '<script>alert("xss")</script>Tafsir teks.';
      const formatted = formatTafsirText(malicious);
      expect(formatted).not.toContain('<script>');
      expect(formatted).toContain('Tafsir teks.');
    });
  });
});
