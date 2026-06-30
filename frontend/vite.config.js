import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: false,
    // Keep all CSS in one file so inline-css.js can safely inline & delete it
    // without Vite's JS runtime dynamically requesting split CSS files
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react-router')) {
              return 'framework';
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'charts';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
