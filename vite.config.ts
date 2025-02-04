import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/my-home/", // 리포지토리 이름을 포함한 경로 설정
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    cors: true, // 개발 서버 CORS 설정
    host: "localhost",
    port: 5173,
  },
});
