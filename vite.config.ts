import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/my-home/", // GitHub Pages에 맞게 설정
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    cors: true,
    host: "localhost",
    port: 5173,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets", // 정적 파일이 저장될 폴더 지정
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
});
