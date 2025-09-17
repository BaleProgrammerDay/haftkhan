import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const targetUrl = "https://hafkhan.duckwichtrust.tech/";

const phasermsg = () => {
  return {
    name: "phasermsg",
    buildStart() {
      process.stdout.write(`Building for production...\n`);
      process.stdout.write(`Target URL: ${targetUrl}\n`);
    },
    buildEnd() {
      const line = "---------------------------------------------------------";
      const msg = `❤️❤️❤️ Tell us about your game! - games@phaser.io ❤️❤️❤️`;
      process.stdout.write(`${line}\n${msg}\n${line}\n`);

      process.stdout.write(`✨ Done ✨\n`);
    },
  };
};

export default defineConfig({
  base: "./",
  plugins: [react(), phasermsg()],
  define: {
    "import.meta.env.DEV": false,
    "import.meta.env.PROD": true,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "../src"),
    },
  },
  logLevel: "warning",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ["phaser"],
        },
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        passes: 2,
      },
      mangle: true,
      format: {
        comments: false,
      },
    },
  },
});

