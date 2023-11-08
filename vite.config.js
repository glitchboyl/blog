import { defineConfig, splitVendorChunkPlugin } from "vite";
import solid from "vite-plugin-solid";
import UnoCSS from "unocss/vite";
import getPostsPlugin from "./get-posts-plugin";

const cdn = (path) => `https://cdn.jsdelivr.net/npm/${path}`;

export default defineConfig({
  plugins: [solid(), UnoCSS(), getPostsPlugin(), splitVendorChunkPlugin()],
  esbuild: {
    pure: ["console.log"],
  },
  build: {
    minify: true,
    rollupOptions: {
      treeshake: true,
      external: ["markdown-it", "shiki"],
      output: {
        paths: {
          "markdown-it": cdn("markdown-it@13.0.2/dist/markdown-it.min.js/+esm"),
          shiki: cdn("shiki@0.14.5/+esm"),
        },
      },
    },
  },
});
