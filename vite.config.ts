import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'], // ✅ Exclude lucide-react from pre-bundling (only if necessary)
  },
  build: {
    rollupOptions: {
      external: [], // ⬅️ Do NOT exclude react-router-dom here!
    },
  },
});
