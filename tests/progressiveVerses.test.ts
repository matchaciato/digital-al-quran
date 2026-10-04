import { describe, it, expect, vi } from 'vitest';
import { ref } from 'vue';
import { useProgressiveVerses } from '~/composables/useProgressiveVerses';
import type { Verse } from '~/types/quran';

// Mock audioStore
vi.mock('~/stores/useAudioStore', () => ({
  useAudioStore: () => ({
    currentVerseKey: null
  })
}));

describe('useProgressiveVerses Composable', () => {
  const createMockVerses = (count: number): Verse[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      verse_number: i + 1,
      verse_key: `1:${i + 1}`,
      text_uthmani: `آية ${i + 1}`,
      words: []
    } as unknown as Verse));
  };

  it('should immediately show all verses if total count <= initialBatch', () => {
    const verses = ref(createMockVerses(7));
    const { visibleVerses, isAllLoaded, totalCount } = useProgressiveVerses(verses, {
      initialBatch: 25,
      batchStep: 25
    });

    expect(totalCount.value).toBe(7);
    expect(visibleVerses.value.length).toBe(7);
    expect(isAllLoaded.value).toBe(true);
  });

  it('should paginate long surahs with initialBatch and allow loadMore and loadAll', () => {
    const verses = ref(createMockVerses(100));
    const { visibleVerses, isAllLoaded, visibleCount, loadMore, loadAll } = useProgressiveVerses(verses, {
      initialBatch: 25,
      batchStep: 25
    });

    expect(visibleCount.value).toBe(25);
    expect(visibleVerses.value.length).toBe(25);
    expect(isAllLoaded.value).toBe(false);

    // Load next batch
    loadMore();
    expect(visibleCount.value).toBe(50);
    expect(visibleVerses.value.length).toBe(50);
    expect(isAllLoaded.value).toBe(false);

    // Load all
    loadAll();
    expect(visibleCount.value).toBe(100);
    expect(visibleVerses.value.length).toBe(100);
    expect(isAllLoaded.value).toBe(true);
  });
});
