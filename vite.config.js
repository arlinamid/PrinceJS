import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: "./index.html"
      }
    }
  },
  server: {
    port: 8080,
    open: true
  },
  publicDir: "public",
  define: {
    global: "globalThis"
  },
  optimizeDeps: {
    exclude: ["lib/phaser.min.js"]
  }
});
