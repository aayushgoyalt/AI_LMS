import { defineConfig } from 'vite';
import { viteSingleFile } from "vite-plugin-singlefile";
import { compression } from 'vite-plugin-compression2';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    solidPlugin(),
    viteSingleFile({ removeViteModuleLoader: true }),
    compression({exclude: [/\.(br)$/, /\.(gz)$/], deleteOriginalAssets: true }),
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
  ],
  server: {
    cors: true,
    host: '127.0.0.1',
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});

