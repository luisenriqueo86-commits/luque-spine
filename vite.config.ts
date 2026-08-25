/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/luque-spine/',
   plugins: [
  react(),
  legacy(),
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Luque Spine',
      short_name: 'Luque Spine',
      description:
        'Registro clínico y seguimiento de cirugía de columna',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/luque-spine/',
scope: '/luque-spine/',
      icons: [
        {
           src: 'icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  }),
],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
