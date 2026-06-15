
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    // Cette ligne est cruciale pour corriger la page blanche sur GitHub Pages
    // Assure-toi que le nom correspond exactement au nom de ton dépôt GitHub
    base: '/worldsaoury/', 
    
    plugins: [
      react(), 
      tailwindcss(),
      // Plugin personnalisé pour copier tes images de la racine vers dist/
      {
        name: 'copy-root-images',
        closeBundle() {
          const rootDir = __dirname;
          const distDir = path.resolve(__dirname, 'dist');
          if (!fs.existsSync(distDir)) return;
          try {
            const files = fs.readdirSync(rootDir);
            files.forEach(file => {
              const lower = file.toLowerCase();
              if (lower.endsWith('.jpg') || 
                  lower.endsWith('.jpeg') || 
                  lower.endsWith('.png') || 
                  lower.endsWith('.svg')) {
                const srcPath = path.join(rootDir, file);
                const destPath = path.join(distDir, file);
                fs.copyFileSync(srcPath, destPath);
                console.log([copy-root-images] Copied ${file} to dist/);
              }
            });
          } catch (err) {
            console.error('[copy-root-images] Error copying root files:', err);
          }
        },
        // Configuration du serveur de développement pour servir tes images
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            const decUrl = decodeURIComponent(url).split('?')[0];
            const lowerUrl = decUrl.toLowerCase();
            if (lowerUrl.endsWith('.jpg') || 
                lowerUrl.endsWith('.jpeg') || 
                lowerUrl.endsWith('.png') || 
                lowerUrl.endsWith('.svg')) {
              const fileName = path.basename(decUrl);
              const filePath = path.join(__dirname, fileName);
              if (fs.existsSync(filePath)) {
                const isSvg = lowerUrl.endsWith('.svg');
                const isPng = lowerUrl.endsWith('.png');
                res.setHeader('Content-Type', isSvg ? 'image/svg+xml' : (isPng ? 'image/png' : 'image/jpeg'));
                fs.createReadStream(filePath).pipe(res);
                return;
              }
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': __dirname,
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
