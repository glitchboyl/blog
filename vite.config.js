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
      external: [
        "markdown-it",
        "highlight.js",
        //  "highlight.js/styles/nord.css"
      ],
      output: {
        paths: {
          "markdown-it": cdn("markdown-it@13.0.2/dist/markdown-it.min.js/+esm"),
          "highlight.js": cdn("highlight.js@11.9.0/+esm"),
          // "highlight.js/styles/nord.css": cdn(
          //   "highlight.js@11.9.0/styles/nord.min.css"
          // ),
        },
      },
    },
  },
});
