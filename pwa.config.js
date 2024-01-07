import process from 'node:process'
const appName = process.env.VITE_PWA_APP_NAME || 'Bang'
const appShortName = process.env.VITE_PWA_APP_NAME || 'Bang'
const appDescription = process.env.VITE_PWA_APP_DESC || 'This is bang \'s web application'

const scope = '/'

const icons = [
    {
        src: 'pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png'
    },
    {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
    },
    {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
    },
    {
        src: 'maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
    }
]

export const pwa = {
    injectRegister: 'auto',
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    scope,
    base: scope,
    manifest: {
        id: scope,
        scope,
        name: appName,
        short_name: appShortName,
        description: appDescription,
        theme_color: '#00bd7e',
        icons,
    },
    workbox: {
        globPatterns: ['**/*.{js,css,html,txt,png,ico,svg,gif,json,jpg}'],
        navigateFallbackDenylist: [/^\/api\//],
        // navigateFallback: '/',
        // https://github.com/vite-pwa/vite-plugin-pwa/issues/120#issuecomment-1440520077
        // https://github.com/vite-pwa/vite-plugin-pwa/issues/402#issuecomment-1295168405
        navigateFallback: null,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/fonts.googleapis.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'google-fonts-cache',
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
            {
                urlPattern: /^https:\/\/fonts.gstatic.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'gstatic-fonts-cache',
                    expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                    },
                    cacheableResponse: {
                        statuses: [0, 200],
                    },
                },
            },
        ],
    },
    devOptions: {
        enabled: process.env.VITE_PLUGIN_PWA === 'true',
        navigateFallback: scope,
    }
}
