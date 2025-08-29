import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // ВАЖНО: имя репозитория со слешами
  base: '/CareBee/',
  plugins: [react()],
});
