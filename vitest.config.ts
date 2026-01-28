/**
 * Vitest configuration for React Console testing
 * 
 * Configured for terminal/console testing with proper mocking of terminal APIs.
 */

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.git'],
    // Set deps.inline to handle require() properly
    deps: {
      interopDefault: true,
    },
    // Setup file for common mocks
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/examples/',
      ],
    },
  },
});
