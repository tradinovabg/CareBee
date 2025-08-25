import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // ОБЯЗАТЕЛЬНО для GitHub Pages на /CareBee/
  base: '/CareBee/',
  plugins: [react()],
})
