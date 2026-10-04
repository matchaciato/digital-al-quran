<template>
  <header class="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-baseline gap-3 rounded-md" aria-label="Al-Qur'an Digital, ke beranda">
        <span class="text-lg font-bold tracking-tight text-foreground">Al-Qur'an</span>
        <span class="quran-arabic hidden text-base text-muted-foreground sm:inline" lang="ar" dir="rtl" aria-hidden="true">
          القرآن الكريم
        </span>
      </NuxtLink>

      <nav class="hidden md:block" aria-label="Navigasi utama">
        <ul class="flex items-center gap-1">
          <li v-for="item in items" :key="item.href">
            <NuxtLink
              :to="item.href"
              :aria-current="isCurrent(item) ? 'page' : undefined"
              class="inline-flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors"
              :class="
                isCurrent(item)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              "
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Buka pencarian cepat"
          aria-keyshortcuts="Control+K Meta+K"
          @click="$emit('openCommand')"
        >
          <Search class="h-4 w-4" aria-hidden="true" />
          <span class="hidden lg:inline">Cari</span>
          <kbd class="hidden rounded border border-border px-1.5 text-xs font-sans lg:inline">Ctrl K</kbd>
        </button>

        <CommonLanguageSwitcher />

        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          :aria-label="settings.isDarkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'"
          @click="settings.toggleDarkMode()"
        >
          <Moon v-if="settings.isDarkMode" class="h-4 w-4" aria-hidden="true" />
          <Sun v-else class="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          class="inline-flex h-10 items-center rounded-md border border-input px-3 text-sm font-medium text-foreground hover:bg-muted"
          @click="settings.openSettings()"
        >
          Pengaturan
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Search, Moon, Sun } from '@lucide/vue';
import { useSettingsStore } from '~/stores/useSettingsStore';
import { useNavigation } from '~/composables/useNavigation';

defineEmits<{
  (e: 'openCommand'): void;
}>();

const settings = useSettingsStore();
const { items, isCurrent } = useNavigation();
</script>
