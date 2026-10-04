<template>
  <nav
    aria-label="Navigasi seluler"
    class="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background md:hidden"
  >
    <ul class="mx-auto grid max-w-xl grid-cols-5">
      <li v-for="item in items" :key="item.href">
        <NuxtLink
          :to="item.href"
          :aria-current="isCurrent(item) ? 'page' : undefined"
          class="flex h-14 items-center justify-center px-1 text-xs font-medium transition-colors"
          :class="
            isCurrent(item)
              ? 'text-primary shadow-[inset_0_2px_0_0_var(--primary)]'
              : 'text-muted-foreground hover:text-foreground'
          "
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation';

const { items, isCurrent } = useNavigation();
</script>
