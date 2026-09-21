<template>
  <nav
    aria-label="Navigasi Seluler"
    class="md:hidden fixed bottom-0 left-0 right-0 z-30 flex h-14 items-center justify-around border-t border-border/80 bg-background/95 px-2 backdrop-blur-lg shadow-lg"
  >
    <NuxtLink
      v-for="item in navItems"
      :key="item.href"
      :to="item.href"
      class="flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors"
      :class="[
        isActive(item.href)
          ? 'text-primary font-semibold'
          : 'text-muted-foreground hover:text-foreground'
      ]"
    >
      <component :is="item.icon" class="h-4 w-4" />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { BookOpen, Layers, Compass, Search, BookmarkCheck } from '@lucide/vue';
import { useI18n } from '~/composables/useI18n';

const route = useRoute();
const { t } = useI18n();

const navItems = computed(() => [
  { label: t('nav.surah'), href: '/', icon: BookOpen },
  { label: t('nav.juz'), href: '/juz/1', icon: Layers },
  { label: t('nav.topics'), href: '/topics', icon: Compass },
  { label: t('nav.search'), href: '/search', icon: Search },
  { label: t('nav.tadabbur'), href: '/bookmark', icon: BookmarkCheck }
]);

const isActive = (href: string) => {
  if (href === '/') {
    return route.path === '/' || route.path.startsWith('/surah');
  }
  return route.path.startsWith(href);
};
</script>
