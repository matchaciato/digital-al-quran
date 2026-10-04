import { ref, computed, watch, onMounted, onUnmounted, nextTick, getCurrentInstance, type Ref, type ComputedRef } from 'vue';
import type { Verse } from '~/types/quran';
import { useAudioStore } from '~/stores/useAudioStore';

export interface UseProgressiveVersesOptions {
  initialBatch?: number;
  batchStep?: number;
  rootMargin?: string;
}

export function useProgressiveVerses(
  allVerses: Ref<Verse[] | undefined> | ComputedRef<Verse[] | undefined>,
  options: UseProgressiveVersesOptions = {}
) {
  const {
    initialBatch = 25,
    batchStep = 25,
    rootMargin = '500px'
  } = options;

  const audioStore = useAudioStore();
  const visibleCount = ref<number>(initialBatch);
  const sentinelRef = ref<HTMLElement | null>(null);
  let observer: IntersectionObserver | null = null;

  const totalCount = computed(() => allVerses.value?.length || 0);

  const isAllLoaded = computed(() => {
    return visibleCount.value >= totalCount.value;
  });

  const visibleVerses = computed(() => {
    const list = allVerses.value;
    if (!list || list.length === 0) return [];
    if (list.length <= initialBatch) return list;
    return list.slice(0, visibleCount.value);
  });

  const loadMore = () => {
    if (isAllLoaded.value) return;
    visibleCount.value = Math.min(totalCount.value, visibleCount.value + batchStep);
  };

  const loadAll = () => {
    visibleCount.value = totalCount.value;
  };

  const ensureVerseVisible = (verseKey: string) => {
    if (!verseKey || !allVerses.value) return;
    const index = allVerses.value.findIndex(v => v.verse_key === verseKey);
    if (index >= 0 && index >= visibleCount.value) {
      visibleCount.value = Math.min(totalCount.value, index + batchStep);
    }
  };

  watch(() => audioStore.currentVerseKey, (currentKey) => {
    if (currentKey) {
      ensureVerseVisible(currentKey);
    }
  });

  const checkHashTarget = () => {
    if (import.meta.client && window.location.hash) {
      const match = window.location.hash.match(/#verse-(\d+:\d+)/);
      if (match && match[1]) {
        ensureVerseVisible(match[1]);
      }
    }
  };

  const setupObserver = () => {
    if (!import.meta.client) return;
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (isAllLoaded.value || !sentinelRef.value) return;

    observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry?.isIntersecting) {
        loadMore();
      }
    }, {
      root: null,
      rootMargin,
      threshold: 0.1
    });

    observer.observe(sentinelRef.value);
  };

  watch(sentinelRef, () => {
    setupObserver();
  });

  watch(isAllLoaded, (all) => {
    if (all && observer) {
      observer.disconnect();
      observer = null;
    } else if (!all) {
      nextTick(() => setupObserver());
    }
  });

  watch(() => allVerses.value?.length, (newLen) => {
    if (!newLen) {
      visibleCount.value = initialBatch;
    } else if (newLen <= initialBatch) {
      visibleCount.value = newLen;
    } else {
      visibleCount.value = initialBatch;
      checkHashTarget();
    }
    nextTick(() => setupObserver());
  }, { immediate: true });

  if (getCurrentInstance()) {
    onMounted(() => {
      checkHashTarget();
      setupObserver();
    });

    onUnmounted(() => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    });
  }

  return {
    visibleVerses,
    visibleCount,
    totalCount,
    isAllLoaded,
    sentinelRef,
    loadMore,
    loadAll,
    ensureVerseVisible
  };
}
