<template>
  <div class="inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs font-semibold">
    <button
      type="button"
      v-for="loc in availableLocales"
      :key="loc.code"
      @click="i18n.setLocale(loc.code)"
      class="rounded-md px-2 py-1 transition-all"
      :class="[
        i18n.currentLocale.value === loc.code
          ? 'bg-card text-primary shadow-xs font-bold'
          : 'text-muted-foreground hover:text-foreground'
      ]"
      :title="loc.name"
    >
      {{ loc.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n, type AppLocale } from '~/composables/useI18n';

const i18n = useI18n();

const availableLocales: Array<{ code: AppLocale; label: string; name: string }> = [
  { code: 'id', label: 'ID', name: 'Bahasa Indonesia' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'العربية', name: 'Arabic' }
];
</script>
