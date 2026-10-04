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
      htmlAttrs: { lang: 'id' },
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
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://api.quran.com' },
        { rel: 'preconnect', href: 'https://audio.qurancdn.com', crossorigin: '' },
        { rel: 'preconnect', href: 'https://equran.id' }
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
      id: '/?source=pwa',
      name: 'Digital Al-Qur\'an — Editorial Typography & Linguistic Anatomy',
      short_name: 'Al-Qur\'an',
      description: 'Platform Al-Qur\'an Digital modern berkelas dunia, cepat, hemat memori & kuota, dengan audio murottal 30 juz, tafsir lengkap Kemenag RI, dan kajian anatomi kata.',
      theme_color: '#1B4D3E',
      background_color: '#FAF8F5',
      display: 'standalone',
      display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
      orientation: 'any',
      lang: 'id',
      dir: 'ltr',
      categories: ['education', 'books', 'lifestyle', 'utilities'],
      start_url: '/?source=pwa',
      scope: '/',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      shortcuts: [
        {
          name: 'Surah Al-Fatihah',
          short_name: 'Al-Fatihah',
          description: 'Buka Surah Al-Fatihah (Pembukaan)',
          url: '/surah/1',
          icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
        },
        {
          name: 'Juz \'Amma (Juz 30)',
          short_name: 'Juz 30',
          description: 'Buka kumpulan surah pendek Juz 30',
          url: '/juz/30',
          icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
        },
        {
          name: 'Pencarian Ayat',
          short_name: 'Cari Ayat',
          description: 'Cari ayat, kata, atau terjemahan Al-Qur\'an',
          url: '/search',
          icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
        },
        {
          name: 'Bookmark & Terakhir Dibaca',
          short_name: 'Bookmark',
          description: 'Lihat daftar ayat tersimpan dan penanda baca',
          url: '/bookmark',
          icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
        }
      ]
    },
    workbox: {
      navigateFallback: '/offline.html',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
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
          urlPattern: /^https:\/\/equran\.id\/api\/v2\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'quran-equran-cache',
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
          urlPattern: /^https:\/\/api\.quran\.gading\.dev\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'quran-gading-cache',
            expiration: {
              maxEntries: 300,
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
              maxEntries: 150,
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
              maxEntries: 300,
              maxAgeSeconds: 60 * 60 * 24 * 30
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 60 * 24 * 365
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
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'quran-static-images-cache',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 60 * 60 * 24 * 60
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