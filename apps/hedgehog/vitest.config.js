import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'vitest/config'
import { alias } from './vite.config.js'

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    environment: 'jsdom',
    alias,
    // It's better to import explicitly, but keeping globals makes migration from jest easier
    globals: true,
    poolOptions: {
      threads: {
        minThreads: 1,
      },
    },
  },
})
