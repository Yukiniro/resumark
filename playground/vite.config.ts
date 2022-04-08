import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import WindiCSS from "vite-plugin-windicss";
import { imd } from "vite-plugin-import-md";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), WindiCSS(), imd()],
});
