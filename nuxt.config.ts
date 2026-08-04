import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/globals.css'],

  modules: [
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],

  runtimeConfig: {
    public: {
      quranApiBaseUrl: process.env.NUXT_PUBLIC_QURAN_API_BASE_URL || 'https://api.quran.com/api/v4',
      defaultLanguage: 'id',
      defaultTranslationId: 33,
      defaultReciterId: 7,
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Digital Al-Quran',
      short_name: 'Al-Quran',
      theme_color: '#059669',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.quran\.com\/api\/v4\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'quran-api-cache',
            expiration: {
              maxEntries: 500,
              maxAgeSeconds: 60 * 60 * 24 * 30
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/audio\.qurancdn\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'quran-audio-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  }
})