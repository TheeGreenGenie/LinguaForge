import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'node:child_process';

/** The public GitHub repo, shown in the app's "Help improve" section. CI sets
 *  VITE_REPO_URL; local builds fall back to the git `origin` remote. */
function repoUrl(): string {
  if (process.env.VITE_REPO_URL) return process.env.VITE_REPO_URL;
  try {
    const origin = execSync('git remote get-url origin', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const m = origin.match(/github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/);
    return m ? `https://github.com/${m[1]}` : '';
  } catch {
    return '';
  }
}

// base './' so the build works from GitHub Pages sub-paths
export default defineConfig({
  base: './',
  define: { __REPO_URL__: JSON.stringify(repoUrl()) },
  plugins: [
    preact(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icon.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,gz,m4a,mp3}'],
        maximumFileSizeToCacheInBytes: 60 * 1024 * 1024,
      },
      manifest: {
        name: 'LinguaForge',
        short_name: 'LinguaForge',
        description: 'Learn to read and write Portuguese, Yoruba, Mandarin, Spanish and French',
        theme_color: '#1f6f5c',
        background_color: '#f7f5ef',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
  ],
});
