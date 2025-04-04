import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  root: "src/renderer",
  base: "./",
  build: {
    outDir: "../../dist/renderer",
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        pure_funcs: ['console.log', 'console.debug'], // 특정 console 메서드만 제거
        drop_debugger: true
      }
    },
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/renderer/index.html'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          const info = assetInfo.name.split('.');
          const extType = info.length > 1 ? info[info.length - 1] : '';
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/renderer"),
      "@assets": path.resolve(__dirname, "src/renderer/assets"),
    },
  },
  server: {
    port: 3005,
    strictPort: true,
  },
});