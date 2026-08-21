<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-16 sm:pt-24 backdrop-blur-xs"
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
            placeholder="Ketik surah, juz, topik, atau perintah (misal: 'al mulk', 'juz 30', 'dark')..."
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
              <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
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
            <span>&crarr; Pilih</span>
          </div>
          <span>Pintasan Global: <strong>Cmd+K</strong></span>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Search } from '@lucide/vue';
import { useSettingsStore } from '~/stores/useSettingsStore';
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
  category: 'Surah' | 'Juz' | 'Topik' | 'Perintah';
  title: string;
  meta?: string;
  action: () => void;
}

const SURAH_DIRECTORY = [
  { id: 1, name: 'Al-Fatihah', arabic: 'الفاتحة' },
  { id: 2, name: 'Al-Baqarah', arabic: 'البقرة' },
  { id: 3, name: 'Ali \'Imran', arabic: 'آل عمران' },
  { id: 4, name: 'An-Nisa\'', arabic: 'النساء' },
  { id: 5, name: 'Al-Ma\'idah', arabic: 'المائدة' },
  { id: 6, name: 'Al-An\'am', arabic: 'الأنعام' },
  { id: 7, name: 'Al-A\'raf', arabic: 'الأعراف' },
  { id: 18, name: 'Al-Kahf', arabic: 'الكهف' },
  { id: 36, name: 'Yasin', arabic: 'يس' },
  { id: 55, name: 'Ar-Rahman', arabic: 'الرحمن' },
  { id: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة' },
  { id: 67, name: 'Al-Mulk', arabic: 'الملك' },
  { id: 112, name: 'Al-Ikhlas', arabic: 'الإخلاص' },
  { id: 113, name: 'Al-Falaq', arabic: 'الفلق' },
  { id: 114, name: 'An-Nas', arabic: 'الناس' }
];

const allCommands = computed<CommandItem[]>(() => {
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
    id: 'cmd-tadabbur',
    category: 'Perintah',
    title: 'Buka Studio Tadabbur & Jurnal',
    meta: 'Halaman',
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

  for (const s of SURAH_DIRECTORY) {
    list.push({
      id: `surah-${s.id}`,
      category: 'Surah',
      title: `Surah ${s.id}. ${s.name}`,
      meta: s.arabic,
      action: () => router.push(`/surah/${s.id}`)
    });
  }

  for (let j = 1; j <= 30; j++) {
    list.push({
      id: `juz-${j}`,
      category: 'Juz',
      title: `Juz ${j}`,
      meta: '30 Juz Al-Qur\'an',
      action: () => router.push(`/juz/${j}`)
    });
  }

  return list;
});

const filteredItems = computed(() => {
  const q = query.value.toLowerCase().trim();
  if (!q) return allCommands.value.slice(0, 15);

  return allCommands.value
    .filter(item => item.title.toLowerCase().includes(q) || (item.meta && item.meta.toLowerCase().includes(q)))
    .slice(0, 20);
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
