import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@Src": path.resolve(__dirname, "./src"),
      "@Components": path.resolve(__dirname, "./src/components"),
      "@Features": path.resolve(__dirname, "./src/features"),
      "@Routes": path.resolve(__dirname, "./src/routes"),
      "@Utils": path.resolve(__dirname, "./src/utils"),
      "@Constant": path.resolve(__dirname, "./src/constant"),
    },
  },
});
