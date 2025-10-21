import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../../build",
    emptyOutDir: false,
    manifest: "manifest.json", // Generate manifest.json in build root
    rollupOptions: {
      input: {
        frontend: resolve(__dirname, "src/main.jsx"),
      },
      output: {
        entryFileNames: "frontend.js",
        chunkFileNames: "frontend-[hash].js",
        assetFileNames: "frontend-[hash].[ext]",
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "production"
    ),
  },
});
