import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";
import tailwindcss from "@tailwindcss/vite";
import process from "process";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseUrl = env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";

  return {
    plugins: [
      svelte({
        prebundleSvelteLibraries: false,
      }),
      tailwindcss(),
      svelteTesting(),
    ],
    server: {
      port: Number(env.APP_PORT) || 3004,
    },
    preview: {
      port: Number(env.APP_PORT) || 3004,
      proxy: {
        "/delcom-api": {
          target: new URL(baseUrl).origin,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/delcom-api/, new URL(baseUrl).pathname.replace(/\/+$/, "")),
        },
      },
    },
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 1500,
    },
    define: {
      // Dipakai untuk URL gambar (absolut).
      DELCOM_BASEURL: JSON.stringify(baseUrl),
      // Build production: request API lewat proxy same-origin (lihat vercel.json).
      ...(mode === "production"
        ? { DELCOM_API_URL: JSON.stringify("/delcom-api") }
        : {}),
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.js",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov"],
        include: ["src/**/*.{js,svelte}"],
        exclude: [
          "src/main.js",
          "src/setupTests.js",
          "src/test-utils.js",
          "**/*.test.{js,jsx}",
          "node_modules/**",
          ".docs/**",
        ],
        thresholds: {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  };
});

