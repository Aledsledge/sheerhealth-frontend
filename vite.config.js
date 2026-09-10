import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Make sure the output directory is set correctly
    emptyOutDir: true, // Cleans the output directory before each build
  },
});
