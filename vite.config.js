import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline', // Force auto-link injection into index.html
      strategies: 'generateSW', // Ensures a clean service worker is built for localhost
      devOptions: {
        enabled: true, // Enables PWA environment testing during npm run dev
        type: 'module'
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'favicon.svg', 'favicon.png'],
      manifest: {
        name: 'OptiSnap — Premium Image Optimizer',
        short_name: 'OptiSnap',
        description: 'Compress and convert images locally in your browser. Private, fast, and offline-ready.',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: './index.html', // FIXED: Points explicitly to your file context path to pass validation
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'favicon.png',
            sizes: '512x512', // FIXED: Provide individual explicit sizes
            type: 'image/png',
            purpose: 'any'
          }
        ]
      }
    })
  ]
})
