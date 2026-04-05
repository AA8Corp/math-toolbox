import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Math Toolbox',
        short_name: 'MathToolbox',
        description:
          'Offline-first interactive math manipulatives for 6th grade — a companion to the AA8 Critical Thinking workbook.',
        theme_color: '#7c3aed',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webp,woff2}'],
      },
      devOptions: {
        // Don't register the SW in dev — it confuses HMR and wastes CPU.
        // We verify PWA behavior against `npm run preview` and in CI.
        enabled: false,
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Exclude Playwright's directory so vitest doesn't try to run e2e
    // tests as unit tests.
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    css: true,
  },
})
