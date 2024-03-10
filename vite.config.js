import { fileURLToPath, URL } from 'node:url';
import dns from 'node:dns';
import process from 'node:process';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';
import { VitePWA } from 'vite-plugin-pwa';
import { pwa } from './pwa.config';

// @see: https://vitejs.dev/config/server-options.html#server-host
dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig((config) => {
  // load .env
  const env = loadEnv(config.mode, process.cwd(), '');
  const domain = new URL(env.VITE_APP_URL || 'https://template.bang.test');

  return {
    plugins: [
      mkcert({
        source: 'coding',
      }),
      react(),
      VitePWA(pwa),
    ],
    esbuild: {
      legalComments: 'none',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@lib': fileURLToPath(new URL('./src/_libs', import.meta.url)),
      },
    },
    server: {
      host: domain.hostname,
      https: true,
      strictPort: true,
    },
  };
});
