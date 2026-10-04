import { QURAN_API } from '~/constants/quran';

export function validateChapterId(id: number): number {
  const parsed = Math.floor(Number(id));
  if (isNaN(parsed) || parsed < QURAN_API.MIN_CHAPTER || parsed > QURAN_API.MAX_CHAPTER) {
    throw new Error(`Invalid chapter ID: ${id}. Must be between ${QURAN_API.MIN_CHAPTER} and ${QURAN_API.MAX_CHAPTER}.`);
  }
  return parsed;
}

export function validateJuzId(id: number): number {
  const parsed = Math.floor(Number(id));
  if (isNaN(parsed) || parsed < QURAN_API.MIN_JUZ || parsed > QURAN_API.MAX_JUZ) {
    throw new Error(`Invalid juz ID: ${id}. Must be between ${QURAN_API.MIN_JUZ} and ${QURAN_API.MAX_JUZ}.`);
  }
  return parsed;
}

export function validatePageId(id: number): number {
  const parsed = Math.floor(Number(id));
  if (isNaN(parsed) || parsed < QURAN_API.MIN_PAGE || parsed > QURAN_API.MAX_PAGE) {
    throw new Error(`Invalid page ID: ${id}. Must be between ${QURAN_API.MIN_PAGE} and ${QURAN_API.MAX_PAGE}.`);
  }
  return parsed;
}

export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') return '';
  return query.trim().slice(0, 100);
}

export function stripHtmlTags(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<sup[^>]*>.*?<\/sup>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function validateVerseKey(verseKey: string): { chapterId: number; verseNumber: number } {
  const parts = String(verseKey || '').trim().split(':');
  if (parts.length !== 2) {
    throw new Error(`Format verse_key tidak valid: "${verseKey}". Format yang diharapkan adalah "surah:ayat" (contoh: "1:1").`);
  }
  const chapterId = validateChapterId(Number(parts[0]));
  const verseNumber = Math.floor(Number(parts[1]));
  if (isNaN(verseNumber) || verseNumber < 1) {
    throw new Error(`Nomor ayat tidak valid: "${parts[1]}". Harus berupa bilangan bulat positif.`);
  }
  return { chapterId, verseNumber };
}

export function formatTafsirText(raw: string): string {
  if (typeof raw !== 'string') return '';
  const text = raw.trim();
  if (!text) return '';

  const sanitized = text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '');

  if (/<(p|div|h[1-6]|ul|ol|table|blockquote)\b/i.test(sanitized)) {
    return sanitized;
  }

  const paragraphs = sanitized
    .split(/\r?\n\s*\r?\n/)
    .map(p => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return '';

  return paragraphs
    .map(p => {
      const withBreaks = p.replace(/\r?\n/g, '<br />');
      return `<p class="mb-4 leading-relaxed">${withBreaks}</p>`;
    })
    .join('');
}

