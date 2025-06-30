import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"]
    })
  ],

  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true
  },

  // Asset handling
  assetsInclude: ["**/*.mp3", "**/*.wav", "**/*.ogg", "**/*.json"],

  // Public directory for static assets
  publicDir: "assets",

  // Build configuration
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: "index.html"
      }
    }
  },

  // Base URL configuration
  base: "./",

  // Define global variables for Node.js compatibility
  define: {
    global: "globalThis",
    "process.env": {}
  },

  // Optimize dependencies
  optimizeDeps: {
    include: ["phaser"]
  }
});
