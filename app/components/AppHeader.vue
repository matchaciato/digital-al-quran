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

      <nav class="flex items-center gap-1 sm:gap-2">
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
          @click="settings.toggleDarkMode()"
          class="rounded-md size-5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          :title="
            settings.isDarkMode
              ? 'Beralih ke Mode Terang'
              : 'Beralih ke Mode Gelap'
          "
        >
          <Moon v-if="settings.isDarkMode" class="size-full" />
          <Sun v-else class="size-full" />
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
import { Moon, Sun } from "@lucide/vue";
import { useSettingsStore } from "~/stores/useSettingsStore";

const settings = useSettingsStore();

const navigations = [
  { name: "Surah", href: "/" },
  { name: "Juz", href: "/juz/1" },
  { name: "Topik", href: "/topics" },
  { name: "Pencarian", href: "/search" },
  { name: "Tadabbur", href: "/bookmark" },
];
</script>
