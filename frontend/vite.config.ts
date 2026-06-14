import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/ml": {
        target: "http://127.0.0.1:8010",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ml/, "")
      },
      // Same-origin in dev — avoids browser blocking localhost:5173 → 127.0.0.1:5000
      "/api/auth": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true
      },
      "/api/patient": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true
      }
    }
  }
});

