import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.html'),
        'popup/popup': resolve(__dirname, 'src/popup/popup.ts'),
        background: resolve(__dirname, 'src/background.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      }
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' },
        { src: 'img/*', dest: 'img' }
      ],
      flatten: false
    })
  ]
});
