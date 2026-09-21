<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 sm:pt-24 backdrop-blur-xs"
      @click.self="close"
    >
      <div
        class="flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl transition-all"
      >
        <div class="flex items-center gap-3 border-b border-border px-4 py-3.5 bg-card/50">
          <Search class="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            ref="inputRef"
            type="text"
            v-model="query"
            placeholder="Cari surah, ayat (2:255 atau kahf 10), topik, atau perintah..."
            class="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            @keydown.down.prevent="handleArrowDown"
            @keydown.up.prevent="handleArrowUp"
            @keydown.enter.prevent="handleSelectActive"
            @keydown.esc="close"
          />
          <kbd class="hidden rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-block">
            ESC
          </kbd>
        </div>

        <div class="max-h-80 overflow-y-auto p-2 space-y-1">
          <div v-if="filteredItems.length === 0" class="p-6 text-center text-xs text-muted-foreground">
            Tidak ada hasil untuk "{{ query }}"
          </div>

          <button
            type="button"
            v-for="(item, index) in filteredItems"
            :key="item.id"
            @click="executeItem(item)"
            @mouseenter="selectedIndex = index"
            class="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition-colors"
            :class="[
              selectedIndex === index
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-foreground hover:bg-muted/50'
            ]"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <span
                class="rounded px-1.5 py-0.5 text-[10px] font-semibold"
                :class="[
                  item.category === 'Lompat'
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
                    : 'bg-muted text-muted-foreground'
                ]"
              >
                {{ item.category }}
              </span>
              <span class="truncate">{{ item.title }}</span>
            </div>

            <span v-if="item.meta" class="text-[11px] text-muted-foreground font-mono">
              {{ item.meta }}
            </span>
          </button>
        </div>

        <footer class="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2 text-[11px] text-muted-foreground">
          <div class="flex items-center gap-2">
            <span>&uarr;&darr; Navigasi</span>
            <span>&bull;</span>
            <span>&crarr; Buka</span>
          </div>
          <span>Pintasan Global: <strong>Cmd+K / Ctrl+K</strong></span>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Search } from '@lucide/vue';
import { useSettingsStore } from '~/stores/useSettingsStore';
import { ALL_SURAHS } from '~/constants/surahs';
import { THEMATIC_TOPICS } from '~/constants/topics';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const router = useRouter();
const settings = useSettingsStore();

const query = ref('');
const selectedIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);

interface CommandItem {
  id: string;
  category: 'Lompat' | 'Surah' | 'Juz' | 'Topik' | 'Perintah';
  title: string;
  meta?: string;
  action: () => void;
}

const baseCommands = computed<CommandItem[]>(() => {
  const list: CommandItem[] = [];

  list.push({
    id: 'cmd-theme',
    category: 'Perintah',
    title: settings.isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap',
    meta: 'Tema',
    action: () => settings.toggleDarkMode()
  });

  list.push({
    id: 'cmd-zen',
    category: 'Perintah',
    title: 'Buka Mode Zen (Bebas Distraksi)',
    meta: 'Membaca',
    action: () => settings.setReadingMode('zen')
  });

  list.push({
    id: 'cmd-settings',
    category: 'Perintah',
    title: 'Buka Panel Pengaturan Font & Tampilan',
    meta: 'Drawer',
    action: () => settings.openSettings()
  });

  list.push({
    id: 'cmd-search',
    category: 'Perintah',
    title: 'Buka Halaman Pencarian Kata Kunci',
    meta: 'Cari',
    action: () => router.push('/search')
  });

  list.push({
    id: 'cmd-tadabbur',
    category: 'Perintah',
    title: 'Buka Studio Tadabbur & Jurnal Refleksi',
    meta: 'Jurnal',
    action: () => router.push('/bookmark')
  });

  // Thematic Topics
  for (const topic of THEMATIC_TOPICS) {
    list.push({
      id: `topic-${topic.slug}`,
      category: 'Topik',
      title: topic.title,
      meta: topic.category,
      action: () => router.push(`/topics/${topic.slug}`)
    });
  }

  // All 114 Surahs
  for (const s of ALL_SURAHS) {
    list.push({
      id: `surah-${s.id}`,
      category: 'Surah',
      title: `Surah ${s.id}. ${s.name} (${s.meaning})`,
      meta: s.arabic,
      action: () => router.push(`/surah/${s.id}`)
    });
  }

  // 30 Juz
  for (let j = 1; j <= 30; j++) {
    list.push({
      id: `juz-${j}`,
      category: 'Juz',
      title: `Juz ${j}`,
      meta: '30 Juz',
      action: () => router.push(`/juz/${j}`)
    });
  }

  return list;
});

// Smart jump parser: e.g. "2:255", "18:10", "kahf 10", "al baqarah 255"
const parseSmartJump = (rawQuery: string): CommandItem | null => {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return null;

  // Pattern 1: numbers like "2:255" or "18 10"
  const colonMatch = q.match(/^(\d{1,3})[:\s]+(\d{1,3})$/);
  if (colonMatch) {
    const sId = Number(colonMatch[1]);
    const aId = Number(colonMatch[2]);
    const foundSurah = ALL_SURAHS.find(s => s.id === sId);
    if (foundSurah && aId <= foundSurah.totalVerses) {
      return {
        id: `jump-${sId}-${aId}`,
        category: 'Lompat',
        title: `Lompat ke QS. ${foundSurah.name} : Ayat ${aId}`,
        meta: `Ayat ${sId}:${aId}`,
        action: () => router.push(`/surah/${sId}#verse-${sId}:${aId}`)
      };
    }
  }

  // Pattern 2: surah name followed by verse number (e.g. "kahf 10", "baqarah 255", "al-fatihah 5")
  const nameMatch = q.match(/^([a-z\s'-]+?)\s+(\d{1,3})$/);
  if (nameMatch) {
    const namePart = nameMatch[1]?.trim() || '';
    const aId = Number(nameMatch[2]);
    const cleanName = namePart.replace(/^(surah|qs|surat)\s+/i, '').replace(/[^a-z]/g, '');
    if (cleanName.length >= 2) {
      const foundSurah = ALL_SURAHS.find(s => {
        const sClean = s.name.toLowerCase().replace(/[^a-z]/g, '');
        return sClean.includes(cleanName) || cleanName.includes(sClean);
      });
      if (foundSurah && aId <= foundSurah.totalVerses) {
        return {
          id: `jump-${foundSurah.id}-${aId}`,
          category: 'Lompat',
          title: `Lompat ke QS. ${foundSurah.name} : Ayat ${aId}`,
          meta: `Ayat ${foundSurah.id}:${aId}`,
          action: () => router.push(`/surah/${foundSurah.id}#verse-${foundSurah.id}:${aId}`)
        };
      }
    }
  }

  return null;
};

const filteredItems = computed(() => {
  const q = query.value.toLowerCase().trim();
  const list: CommandItem[] = [];

  const jumpItem = parseSmartJump(query.value);
  if (jumpItem) {
    list.push(jumpItem);
  }

  if (!q) {
    return [...list, ...baseCommands.value.slice(0, 15)];
  }

  const matches = baseCommands.value.filter(item => {
    return item.title.toLowerCase().includes(q) || (item.meta && item.meta.toLowerCase().includes(q));
  });

  return [...list, ...matches].slice(0, 25);
});

watch(() => props.isOpen, (open) => {
  if (open) {
    query.value = '';
    selectedIndex.value = 0;
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});

const handleArrowDown = () => {
  if (filteredItems.value.length === 0) return;
  selectedIndex.value = (selectedIndex.value + 1) % filteredItems.value.length;
};

const handleArrowUp = () => {
  if (filteredItems.value.length === 0) return;
  selectedIndex.value = (selectedIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length;
};

const handleSelectActive = () => {
  const active = filteredItems.value[selectedIndex.value];
  if (active) {
    executeItem(active);
  }
};

const executeItem = (item: CommandItem) => {
  item.action();
  close();
};

const close = () => {
  emit('close');
};
</script>
