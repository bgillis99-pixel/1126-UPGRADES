import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    // CRITICAL FOR APP STORE: This ensures assets load via file:// protocol
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname) // Use current directory as root
      }
    },
    define: {
      // This is critical for Vercel. It grabs the API_KEY from the server environment
      // and passes it to the frontend code securely.
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
    server: {
      port: 3000
    }
  };
});