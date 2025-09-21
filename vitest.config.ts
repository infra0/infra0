import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',         // default: backend-friendly
    include: [
      'cli/src/**/*.test.ts',
      'visualizer/server/tests/**/*.test.ts',
      // 'visualizer/ui/src/**/*.test.ts'
    ],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
