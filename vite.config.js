import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: parseInt(env.VITE_FRONT_PORT) || 5173,
      proxy: {
        "/api": {
          target: `http://localhost:${env.VITE_BACK_PORT || 8080}`,
          changeOrigin: true,
          secure: false,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      },
    },
  };
});
