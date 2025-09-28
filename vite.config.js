/* eslint-env node */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import critical from 'rollup-plugin-critical';

const isCI = process.env.VERCEL === '1' || process.env.CI === 'true';

export default defineConfig({
  plugins: [react()],

  // Serve from site root
  base: '/',

  server: {
    allowedHosts: true,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },

  build: {
    cssCodeSplit: true,
    // Raise the warning threshold a bit; still keep chunking sensible
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Split vendor libs so the main vendor chunk doesn't balloon
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router', 'react-router-dom'],
          icons: ['lucide-react'],
          // add other big libs you use, e.g. charts: ['recharts']
        },
      },
      // Run Critical after the bundle is generated
      plugins: [
        // If you need to temporarily disable on CI: ...(isCI ? [] : [critical({...})])
        critical({
          // Built assets directory
          criticalBase: 'dist/',

          // Use a route, not a filename
          criticalPages: [{ uri: '/', template: 'index' }],

          // MUST be an absolute origin to avoid "Invalid URL"
          // (the plugin internally does new URL(base + uri))
          criticalUrl: 'http://localhost',

          // Options passed to 'critical'
          criticalConfig: {
            inline: true,
            extract: true,
            width: 375,
            height: 667,
            // Resolve assets relative to the built output
            base: 'dist/',
            // minify: true, // enable only if your version supports it cleanly
          },
        }),
      ],
    },
  },
});
