import { Plugin } from "vite";
import yaml from "js-yaml";

const fileRegex = /\.(md)$/;

export default function createResume(): Plugin {
  return {
    name: "vite-plugin-resume",
    async transform(code, id) {
      if (fileRegex.test(id)) {
        try {
          const lines = code.split(/\r?\n/g);
          const configs = [];
          const contents = [];

          let topConfig = null;
          let curConfig = null;
          let inCofnigTag = false;
          let curConfigArr = [];
          let curContentArr = [];
          let blocks = [];
          lines.forEach((text) => {
            if (inCofnigTag) {
              if (text === "---") {
                inCofnigTag = false;
                if (curConfigArr.length) {
                  configs.push([...curConfigArr]);
                  curConfigArr.length = 0;
                }
              } else if (text) {
                curConfigArr.push(text);
              }
            } else {
              if (text === "---") {
                inCofnigTag = true;
                if (curContentArr.length) {
                  contents.push([...curContentArr]);
                  curContentArr.length = 0;
                }

              } else {
                curContentArr.push(text);
              }
            }
          });

          if (curContentArr.length) {
            contents.push([...curContentArr]);
            curContentArr.length = 0;
          }
          console.log(contents);

          return `export default \`${contents[0].join('\n').replace(/`/g, '\\`')}\``;
        } catch (e) {
          return "export default 'hello world'";
        }
      } else {
        return code;
      }
    },
  };
}
