import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [react(), tailwindcss()],
    server: {
        port: 8080,
        proxy: {
            '/api': {
                target: 'https://api.avalai.ir',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/v1'),
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        console.log('Sending Request to the Target:', req.method, req.url);
                        console.log('Rewritten path:', proxyReq.path);
                    });
                    proxy.on('proxyRes', (proxyRes, req, _res) => {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                },
            }
        }
    },
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "../src"),
        },
    },
});

