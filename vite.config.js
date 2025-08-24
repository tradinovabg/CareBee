/* eslint-env node */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/CareBee/',        // имя репозитория для GitHub Pages
})
