import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import purgeCss from 'vite-plugin-purgecss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    purgeCss({
      safelist: {
        standard: ['html', 'body', 'active', 'show', 'fade', 'open', 'collapsed'],
        deep: [
          /^modal-/,
          /^popover-/,
          /^tooltip-/,
          /^navbar-/,
          /^nav-/,
          /^dropdown-/,
          /^recharts-/
        ]
      }
    })
  ],
  build: {
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
            return 'vendor';
          }
        }
      }
    }
  }
})
