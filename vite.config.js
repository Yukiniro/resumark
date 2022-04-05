import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import createResume from "./plugin/vite-plugin-resume";

export default defineConfig({
  plugins: [createResume(), Inspect()],
});
