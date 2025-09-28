/* eslint-env node */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import critical from 'rollup-plugin-critical';

const isCI = process.env.VERCEL === '1' || process.env.CI === 'true';

export default defineConfig({
  plugins: [react()],

  // Serve from site root (don’t point at index.html)
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
    rollupOptions: {
      output: {
        // split vendor deps
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
        },
      },
      // Run Critical after the bundle is created
      plugins: [
        // If you want to disable this on Vercel temporarily, wrap with: ...(isCI ? [] : [critical({...})])
        critical({
          // Where the built HTML/CSS/JS live
          criticalBase: 'dist/',

          // Use a route, not a filename (avoids “undefinedindex.html” joins)
          criticalPages: [{ uri: '/', template: 'index' }],

          // Provide a non-empty URL base so the plugin never builds “undefined…”
          // For purely local processing, '/' is fine.
          criticalUrl: '/',

          // Options passed to the 'critical' library
          criticalConfig: {
            inline: true,
            extract: true,
            width: 375,
            height: 667,
            // The base directory for resolving assets during critical extraction
            // Use the built output so file lookups succeed.
            base: 'dist/',
            // minify: true, // (optional) enable if your plugin version supports it
          },
        }),
      ],
    },
  },
});
