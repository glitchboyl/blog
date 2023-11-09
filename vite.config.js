import { defineConfig, splitVendorChunkPlugin } from "vite";
import solid from "vite-plugin-solid";
import UnoCSS from "unocss/vite";
import { VitePWA } from "vite-plugin-pwa";
import getPostsPlugin from "./get-posts-plugin";

import meta from "./src/meta.data";

const cdn = (path) => `https://cdn.jsdelivr.net/npm/${path}`;

export default defineConfig({
  base: "./",
  plugins: [
    solid(),
    UnoCSS(),
    VitePWA({
      manifest: {
        name: meta.title,
        short_name: meta.title,
        description: meta.description,
        theme_color: "#ffffff",
        // icons: [
        //   {
        //     src: "icon-192x192.png",
        //     sizes: "192x192",
        //     type: "image/png",
        //   },
        //   {
        //     src: "icon-512x512.png",
        //     sizes: "512x512",
        //     type: "image/png",
        //   },
        // ],
      },
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/\//i,
            handler: "CacheFirst",
            options: {
              cacheName: "jsdelivr-cdn",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/i\.loli\.net\/\//i,
            handler: "CacheFirst",
            options: {
              cacheName: "image-hosting-service",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
        navigateFallback: "index.html",
      },
    }),
    getPostsPlugin(),
    splitVendorChunkPlugin(),
  ],
  esbuild: {
    pure: ["console.log"],
  },
  build: {
    minify: true,
    rollupOptions: {
      treeshake: true,
      external: ["markdown-it"],
      output: {
        paths: {
          "markdown-it": cdn("markdown-it@13.0.2/dist/markdown-it.min.js/+esm"),
        },
      },
    },
  },
});
