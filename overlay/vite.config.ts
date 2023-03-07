import { defineConfig } from "vite";
import { resolve } from "path";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");
export default defineConfig({
  // ...
  root,
  publicDir: "../public",
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        overlay: resolve(root, "overlay-game", "index.html"),
        mediaPlayer: resolve(root, "media-player", "index.html"),
        roue: resolve(root, "roue", "index.html"),
      },
    },
  },
});
