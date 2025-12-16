import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5000,
      host: '0.0.0.0',
      allowedHosts: true as any,
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        devOptions: {
          enabled: false
        },
        registerType: 'prompt',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'icons/*.png', 'screenshots/*.png'],
        manifest: false, // We use existing manifest.json in public folder
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,mp3,wav}'],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'audio',
              handler: 'CacheFirst',
              options: {
                cacheName: 'audio-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                }
              }
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
