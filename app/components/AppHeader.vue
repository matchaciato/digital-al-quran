<template>
  <header
    class="flex items-center min-w-xs w-full max-w-none bg-emerald-500 h-15 px-4 border-b border-border shadow-xs sm:px-6 lg:px-8"
  >
    <div class="flex justify-between items-center w-full max-w-7xl mx-auto">
      <NuxtLink to="/"> Al-Qur'an </NuxtLink>

      <nav class="flex items-center gap-x-2">
        <Button v-for="nav in navigations" :key="nav.href" variant="ghost" size="sm" as-child>
          <NuxtLink :to="nav.href">{{ nav.name }}</NuxtLink>
        </Button>
        <Separator orientation="vertical" />
      </nav>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { Button } from './ui/button';
import Separator from './ui/separator/Separator.vue';

const navigations: {
  name: string;
  href: string;
}[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Juz", href: "/juz" },
  { name: "Support", href: "/support" },
  { name: "Contact", href: "/contact" },
];
</script>
