<template>
  <header
    class="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-md transition-colors"
  >
    <div
      class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      <NuxtLink to="/" class="group flex items-center gap-3">
        <span
          class="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary"
        >
          Al-Qur'an
        </span>
        <span
          class="hidden text-xs text-muted-foreground sm:inline-block border-l border-border pl-3"
        >
          القرآن الكريم
        </span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-1 sm:gap-2">
        <NuxtLink
          v-for="nav in navigations"
          :key="nav.href"
          :to="nav.href"
          class="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
          active-class="!text-primary !bg-primary/10 font-semibold"
        >
          {{ nav.name }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="$emit('openCommand')"
          class="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:bg-muted hover:text-foreground transition-colors"
          title="Buka Command Palette (Cmd+K)"
        >
          <Search class="h-3.5 w-3.5" />
          <span class="hidden sm:inline-block font-mono text-[10px]">Cmd+K</span>
        </button>

        <CommonLanguageSwitcher />

        <button
          type="button"
          @click="settings.toggleDarkMode()"
          class="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          :title="
            settings.isDarkMode
              ? 'Beralih ke Mode Terang'
              : 'Beralih ke Mode Gelap'
          "
        >
          <Moon v-if="settings.isDarkMode" class="h-4 w-4" />
          <Sun v-else class="h-4 w-4" />
        </button>

        <button
          type="button"
          @click="settings.openSettings()"
          class="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-muted active:scale-95"
        >
          Pengaturan
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Search, Moon, Sun } from "@lucide/vue";
import { useSettingsStore } from "~/stores/useSettingsStore";
import { useI18n } from "~/composables/useI18n";

defineEmits<{
  (e: 'openCommand'): void;
}>();

const settings = useSettingsStore();
const { t } = useI18n();

const navigations = computed(() => [
  { name: t('nav.surah'), href: "/" },
  { name: t('nav.juz'), href: "/juz/1" },
  { name: t('nav.topics'), href: "/topics" },
  { name: t('nav.search'), href: "/search" },
  { name: t('nav.tadabbur'), href: "/bookmark" },
]);
</script>
