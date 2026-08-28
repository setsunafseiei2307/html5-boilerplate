import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// GitHub Pages はリポジトリ名配下に配信されるため base を切り替える。
// ローカル開発と独自ドメインでは '/' を使う。
const base = process.env.DEPLOY_BASE ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020'
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
});
