import { defineConfig } from "vite";
import { imd } from "vite-plugin-import-md";

export default defineConfig({
  plugins: [imd()],
});
