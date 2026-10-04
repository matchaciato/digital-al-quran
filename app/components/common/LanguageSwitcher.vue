<template>
  <div role="group" aria-label="Bahasa antarmuka" class="inline-flex rounded-md border border-input p-0.5 text-sm">
    <button
      v-for="loc in availableLocales"
      :key="loc.code"
      type="button"
      class="h-9 rounded px-2.5 font-medium transition-colors"
      :class="
        i18n.currentLocale.value === loc.code
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      "
      :aria-pressed="i18n.currentLocale.value === loc.code"
      :aria-label="loc.name"
      :lang="loc.code"
      @click="i18n.setLocale(loc.code)"
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
  { code: 'ar', label: 'AR', name: 'العربية (Arab)' }
];
</script>
