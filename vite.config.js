/* eslint-env node */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// 1. IMPORT the rollup-plugin-critical
import critical from 'rollup-plugin-critical';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // 2. CONFIGURE the critical CSS plugin
    critical({
      // Mandatory for Vite builds
      criticalBase: 'dist/',

      // Define the pages to analyze (focus on the root index page)
      criticalPages: [
        {
          // 'index.html' is the default output for the root
          uri: 'index.html',
          template: 'index',
        },
      ],

      // Configuration details
      criticalConfig: {
        inline: true, // Injects the critical CSS directly into the HTML <head>
        base: 'dist/',
        extract: true, // Removes the inlined CSS from the main external stylesheet

        // Optimizes for a common mobile screen size (e.g., iPhone SE/mini)
        width: 375,
        height: 667,
      },
    }),
  ],
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
      loader: {
        '.js': 'jsx',
      },
    },
  },
  // 3. Optional: Ensure proper build settings for Vercel/Vite
  build: {
    cssCodeSplit: true,
  },
});
