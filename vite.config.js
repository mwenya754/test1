// Vite configuration file
// Vite is a fast build tool and development server for modern web projects

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Enable React plugin to support JSX syntax and React Fast Refresh (hot module replacement)
  plugins: [react()],
  // Required for GitHub Pages when the site is served from /<repo-name>/
  base: '/test1/',
})
