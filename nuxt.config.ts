import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/globals.css'],

  runtimeConfig: {
    public: {
      quranApiBaseUrl: process.env.NUXT_PUBLIC_QURAN_API_BASE_URL || 'https://api.quran.com/api/v4',
      defaultLanguage: 'id',
      defaultTranslationId: 33,
      defaultReciterId: 7,
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['shadcn-nuxt'],
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  }
})