import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/my-home/",
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
    host: "localhost",
    port: 5173,
  },
});
