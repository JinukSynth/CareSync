// vite.config.preload.ts
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "node14", // Electron의 Node 버전에 맞춰 조정
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/main/preload.ts"), // preload.ts의 실제 경로
      formats: ["cjs"], // CommonJS 형식으로 번들링
      fileName: () => "preload.cjs"
    },
    outDir: "dist/main",
    rollupOptions: {
      external: ["electron"] // electron 모듈은 외부 처리
    }
  }
});