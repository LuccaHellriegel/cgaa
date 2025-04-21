/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  // Vitest configuration
  test: {
    environment: 'happy-dom', // Use happy-dom for DOM environment in tests
    globals: true, // Make vitest globals available without importing
  },
});
