import { describe, it, expect } from 'vitest';
import { toArabicDigits, formatAyahGlyph } from '~/utils/arabicFormatters';

describe('arabicFormatters Utility', () => {
  it('should accurately convert numbers to Eastern Arabic numerals', () => {
    expect(toArabicDigits(1)).toBe('١');
    expect(toArabicDigits(255)).toBe('٢٥٥');
    expect(toArabicDigits('786')).toBe('٧٨٦');
    expect(toArabicDigits(0)).toBe('٠');
  });

  it('should format verse end glyph with ornamental brackets', () => {
    expect(formatAyahGlyph(1)).toBe(' ﴿١﴾ ');
    expect(formatAyahGlyph(7)).toBe(' ﴿٧﴾ ');
    expect(formatAyahGlyph(286)).toBe(' ﴿٢٨٦﴾ ');
  });
});
