import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // сайт публикуется под /CareBee/
  base: '/CareBee/',
  plugins: [react()],
})
