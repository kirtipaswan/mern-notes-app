import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Ensure that service-worker.js and manifest.json are copied to the dist folder
    rollupOptions: {
      input: {
        main: 'index.html',
        'service-worker': 'public/service-worker.js', // This might not be needed if placed in public
      },
      output: {
        // Ensure assets are correctly referenced
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'manifest.json') {
            return 'manifest.json';
          }
          if (assetInfo.name === 'service-worker.js') {
            return 'service-worker.js';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
