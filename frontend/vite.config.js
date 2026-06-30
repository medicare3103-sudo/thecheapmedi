import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import purgeCss from 'vite-plugin-purgecss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    purgeCss({
      safelist: {
        standard: ['html', 'body', 'active', 'show', 'fade', 'open', 'collapsed', 'container', 'row', 'col', 'card', 'btn', 'badge'],
        deep: [
          /^modal-/,
          /^popover-/,
          /^tooltip-/,
          /^navbar-/,
          /^nav-/,
          /^dropdown-/,
          /^recharts-/,
          /^col-/,
          /^row-/,
          /^container-/,
          /^m-/, /^p-/, /^my-/, /^mx-/, /^py-/, /^px-/, /^mt-/, /^mb-/, /^ms-/, /^me-/, /^pt-/, /^pb-/, /^ps-/, /^pe-/,
          /^align-/, /^justify-/, /^text-/, /^d-/, /^gap-/, /^g-/, /^border-/, /^flex-/, /^bg-/, /^w-/, /^h-/, /^shadow-/
        ]
      }
    })
  ],
  build: {
    modulePreload: false,
    // Keep all CSS in one file so inline-css.js can safely inline & delete it
    // without Vite's JS runtime dynamically requesting split CSS files
    cssCodeSplit: false,
    // Strip ALL console.* calls and debugger statements from the production bundle.
    // esbuild handles this at compile time — zero runtime overhead, zero bytes shipped.
    // Any future console.log added during dev will also be auto-removed on build.
    esbuild: {
      drop: ['console', 'debugger'],
    },
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
