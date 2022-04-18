import { Plugin } from "vite";
import { parse } from "../core/parse";
import fetch from "node-fetch";

const fileRegex = /\.(md)$/;
export default function createResume(): Plugin {
  return {
    name: "vite-plugin-resume",
    async transform(code, id) {
      if (fileRegex.test(id)) {
        try {
          const html = parse(code, fetch);
          return `export default \`${html}\``;
        } catch (e) {
          console.log(e);
          return "export default 'hello world'";
        }
      } else {
        return code;
      }
    },
  };
}
