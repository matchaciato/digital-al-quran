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
