import { describe, it, expect } from 'vitest';
import { TAFSIR_RESOURCES } from '~/constants/tafsirs';

describe('TAFSIR_RESOURCES Constants', () => {
  it('should have valid and non-empty tafsir options', () => {
    expect(TAFSIR_RESOURCES.length).toBeGreaterThanOrEqual(5);

    TAFSIR_RESOURCES.forEach((resource) => {
      expect(resource.id).toBeGreaterThan(0);
      expect(resource.name.trim().length).toBeGreaterThan(0);
      expect(resource.author.trim().length).toBeGreaterThan(0);
      expect(resource.description.trim().length).toBeGreaterThan(0);
      expect(['id', 'en', 'ar']).toContain(resource.language);
      expect(['kemenag_tahlili', 'kemenag_wajiz', 'qurancom']).toContain(resource.sourceType);
    });
  });

  it('should have Tafsir Kemenag (Tahlili) as ID 1', () => {
    const kemenag = TAFSIR_RESOURCES.find(t => t.id === 1);
    expect(kemenag).toBeDefined();
    expect(kemenag?.language).toBe('id');
    expect(kemenag?.sourceType).toBe('kemenag_tahlili');
  });

  it('should have Tafsir Kemenag (Wajiz) as ID 2', () => {
    const wajiz = TAFSIR_RESOURCES.find(t => t.id === 2);
    expect(wajiz).toBeDefined();
    expect(wajiz?.language).toBe('id');
    expect(wajiz?.sourceType).toBe('kemenag_wajiz');
  });
});
