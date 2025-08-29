import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/CareBee/', // <— ВАЖНО: имя репозитория, со слешами
  plugins: [react()],
})
