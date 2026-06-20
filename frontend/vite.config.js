import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import purgeCSSPlugin from 'vite-plugin-purgecss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    purgeCSSPlugin({
      content: [
        './index.html',
        './src/**/*.{jsx,js,ts,tsx,html}',
      ],
      // Safelist patterns so dynamically used classes are never removed
      safelist: {
        standard: [
          // Bootstrap JS toggled classes
          /^show$/,
          /^collapsing$/,
          /^collapse$/,
          /^modal/,
          /^dropdown/,
          /^offcanvas/,
          /^fade$/,
          /^active$/,
          /^disabled$/,
          // Bootstrap icon classes
          /^bi-/,
          /^bi$/,
          // React router active link
          /^active$/,
          // Toast/alert utility
          /^alert/,
          /^toast/,
          // Utility classes added dynamically
          /^d-/,
          /^text-/,
          /^bg-/,
          /^btn/,
          /^badge/,
          /^spinner/,
          /^placeholder/,
        ],
        deep: [
          /data-bs/,
        ],
        greedy: [],
      },
      // Keep keyframe animations referenced by name
      keyframes: true,
      // Keep CSS variables
      variables: true,
      // PurgeCSS considers these characters part of class names
      defaultExtractor: (content) => {
        // Extract class names including Tailwind-style bracket notation and Bootstrap dynamic prefixes
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || []
        const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || []
        return broadMatches.concat(innerMatches)
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router-dom') ||
              id.includes('react-router')
            ) {
              return 'framework'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})
