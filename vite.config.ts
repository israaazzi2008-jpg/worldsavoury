import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Ensure this matches your repository name EXACTLY
  base: '/worldsavoury/', 
  plugins: [
    react(),
    tailwindcss(),
  ],
});
