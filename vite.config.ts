import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'], // ✅ Exclude lucide-react from pre-bundling
  },
  build: {
    rollupOptions: {
      external: ['react-router-dom'], // ✅ Ensure external modules are handled properly
    },
  },
});
