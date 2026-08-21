export function toArabicDigits(num: number | string): string {
  const digits = String(num);
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return digits.replace(/[0-9]/g, d => arabicDigits[Number(d)]);
}

export function formatAyahGlyph(verseNumber: number | string): string {
  return ` ﴿${toArabicDigits(verseNumber)}﴾ `;
}
