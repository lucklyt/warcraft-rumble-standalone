import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/minis.js')) return 'data-minis';
          if (id.includes('/src/data/')) return 'data-assets';
          if (id.includes('/src/engine/')) return 'engine';
        },
      },
    },
  },
});
