/* vite.config.js */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import critical from 'rollup-plugin-critical';

const enableCritical = !process.env.VERCEL && process.env.ENABLE_CRITICAL !== '0';

export default defineConfig({
  plugins: [react()],
  base: '/',
  logLevel: 'warn', // quieter Vite logs

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },

  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },

  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router', 'react-router-dom'],
          icons: ['lucide-react'],
        },
      },
      plugins: [
        ...(enableCritical
          ? [
              critical({
                criticalBase: 'dist/',
                criticalPages: [{ uri: '/', template: 'index' }],
                // absolute origin to avoid "Invalid URL"
                criticalUrl: 'http://localhost',
                criticalConfig: {
                  inline: true,
                  extract: true,
                  width: 375,
                  height: 667,
                  base: 'dist/',
                },
              }),
            ]
          : []),
      ],
    },
  },
});
