import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
  server: { port: 5174 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.js'],
    exclude: ['**/node_modules/**', 'e2e/**'],
    coverage: {
      provider: 'v8',
      include: ['src/components/**', 'src/utils/**', 'src/hooks/**'],
      exclude: ['src/test/**', 'src/main.jsx'],
      thresholds: {
        statements: 80,
        functions:  80,
        branches:   75,
        lines:      80,
      },
    },
  },
})
