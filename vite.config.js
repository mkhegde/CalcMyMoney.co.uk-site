/* vite.config.js */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import critical from 'rollup-plugin-critical';
import { visualizer } from 'rollup-plugin-visualizer';

// Opt-in critical CSS extraction only when explicitly requested.
const enableCritical = process.env.ENABLE_CRITICAL === '1';

export default defineConfig({
  plugins: [react()],
  base: '/',
  logLevel: 'warn', // quieter Vite logs

  // This is for the dev server (which is failing, but we keep it for completeness)
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  // This tells the 'vite preview' command to also use the proxy.
  preview: {
    port: 5173,
    host: '127.0.0.1',
    open: true, // This will automatically open the browser for you
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },

  optimizeDeps: { esbuildOptions: { loader: { '.js': 'jsx' } } },

  // --- THIS 'build' SECTION WAS MISSING AND IS NOW RESTORED ---
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
        ...(process.env.ANALYZE_BUNDLE === '1'
          ? [
              visualizer({
                filename: 'dist/bundle-report.html',
                template: 'treemap',
                gzipSize: true,
                brotliSize: true,
              }),
            ]
          : []),
      ],
    },
  },
});
