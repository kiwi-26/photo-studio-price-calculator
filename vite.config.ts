import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/photo-studio-price-calculator/' : '/'),
});
