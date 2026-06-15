import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      // Custom plugin to copy root-level images into dist/ output on build
      {
        name: 'copy-root-images',
        closeBundle() {
          const rootDir = path.resolve(__dirname, '.');
          const distDir = path.resolve(__dirname, 'dist');
          if (!fs.existsSync(distDir)) return;
          try {
            const files = fs.readdirSync(rootDir);
            files.forEach(file => {
              if (file.toLowerCase().endsWith('.jpg') || 
                  file.toLowerCase().endsWith('.jpeg') || 
                  file.toLowerCase().endsWith('.png') || 
                  file.toLowerCase().endsWith('.svg')) {
                const srcPath = path.join(rootDir, file);
                const destPath = path.join(distDir, file);
                fs.copyFileSync(srcPath, destPath);
                console.log(`[copy-root-images] Copied ${file} to dist/`);
              }
            });
          } catch (err) {
            console.error('[copy-root-images] Error copying root files:', err);
          }
        },
        // Configure dev server to serve root-level images on requests
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            const decUrl = decodeURIComponent(url).split('?')[0];
            if (decUrl.toLowerCase().endsWith('.jpg') || 
                decUrl.toLowerCase().endsWith('.jpeg') || 
                decUrl.toLowerCase().endsWith('.png') || 
                decUrl.toLowerCase().endsWith('.svg')) {
              const fileName = path.basename(decUrl);
              const filePath = path.join(path.resolve(__dirname, '.'), fileName);
              if (fs.existsSync(filePath)) {
                const isSvg = fileName.toLowerCase().endsWith('.svg');
                const isPng = fileName.toLowerCase().endsWith('.png');
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
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
