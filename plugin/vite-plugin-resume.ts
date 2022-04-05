import { Plugin } from "vite";
import yaml from "js-yaml";
import { marked } from "marked";
import { GlobalConfig, BlockConfig, ResumeOptions } from "./types";

const fileRegex = /\.(md)$/;

interface Block {
  config: BlockConfig;
  content: Array<string>;
}

function parseBlock(block: Block) {
  const { config, content } = block;
  const nextContent = [...content];
  if (config && config.blockStyle) {
    const style = Object.keys(config.blockStyle)
      .map((key) => `${key}:${config.blockStyle[key]}`)
      .join(";");
    nextContent.unshift(`<div style="${style}">`);
    nextContent.push("</div>");
  }

  return marked.parse(nextContent.join("\n"));
}

export default function createResume(): Plugin {
  return {
    name: "vite-plugin-resume",
    async transform(code, id) {
      if (fileRegex.test(id)) {
        try {
          const lines = code.split(/\r?\n/g);
          let globalConfig: GlobalConfig | null = null;
          let inCofnigTag = false;
          let curConfigArr = [];
          let curContentArr = [];
          let blocks = [];

          const append = () => {
            if (curContentArr.length) {
              let curConfig = globalConfig ? { ...globalConfig } : null;
              if (curConfigArr.length) {
                console.log(curConfigArr.join("\n"));
                curConfig = yaml.load(curConfigArr.join("\n"));
                if (!blocks.length) {
                  globalConfig = { ...curConfig };
                }
              }
              blocks.push({
                config: { ...globalConfig, ...curConfig },
                content: [...curContentArr],
              });
            }
          };

          lines.forEach((text) => {
            if (text === "---") {
              inCofnigTag = !inCofnigTag;
              if (inCofnigTag) {
                append();
                curConfigArr.length = 0;
                curContentArr.length = 0;
              }
            } else {
              if (inCofnigTag) {
                curConfigArr.push(text);
              } else {
                curContentArr.push(text);
              }
            }
          });
          append();
          const html = blocks.map((block) => parseBlock(block)).join();
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
