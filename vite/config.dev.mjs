import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Development config always uses localhost

const isDev = false;

const targetUrl = isDev ? "http://localhost:8080" : "http://37.32.26.173:8080";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: targetUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
            console.log("Rewritten path:", proxyReq.path);
            console.log("Target URL:", targetUrl);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "../src"),
    },
  },
});

