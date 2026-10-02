import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/globals.css'],
  devServer: {
    port: 4000
  },

  app: {
    head: {
      title: 'Digital Al-Qur\'an — Editorial Typography & Linguistic Anatomy',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' },
        { name: 'description', content: 'Platform Al-Qur\'an Digital modern berkelas dunia dengan tipografi editorial presisi, 4 mode membaca, anatomi morfologi kata, dan audio studio hafalan.' },
        { name: 'theme-color', content: '#1B4D3E' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' }
      ]
    }
  },

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
      name: 'Digital Al-Qur\'an Platform',
      short_name: 'Al-Qur\'an',
      description: 'Platform Al-Qur\'an Digital Editorial Berkelas Dunia',
      theme_color: '#1B4D3E',
      background_color: '#FAF8F5',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
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
        },
        {
          urlPattern: /^https:\/\/verses\.quran\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'quran-verses-audio-cache',
            expiration: {
              maxEntries: 200,
              maxAgeSeconds: 60 * 60 * 24 * 30
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /\.(?:woff2|woff|ttf|otf|eot)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'quran-local-fonts-cache',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: false,
      type: 'module',
      suppressWarnings: true
    }
  },

  vite: {
    plugins: [
      tailwindcss() as any,
    ],
  },

  shadcn: {
    prefix: '',
    componentDir: '@/components/ui'
  }
});