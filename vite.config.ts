import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // https://ja.vite.dev/guide/static-deploy.html#github-pages
  base: '/sasa_tools/',
})
