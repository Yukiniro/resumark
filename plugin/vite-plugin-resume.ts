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

  let html = marked.parse(nextContent.join("\n"));
  if (html && config) {
    let style = "";
    let className = "";
    const { blockClassName, blockStyle } = config;
    if (blockStyle) {
      style = Object.keys(config.blockStyle)
        .map((key) => `${key}:${config.blockStyle[key]}`)
        .join(";");
    }
    if (blockClassName) {
      className = blockClassName;
    }
    html = `<div style="${style}" class="${className}">${html}</div>`;
  }
  return html;
}

export default function createResume(): Plugin {
  return {
    name: "vite-plugin-resume",
    async transform(code, id) {
      if (fileRegex.test(id)) {
        try {
          const lines = code.trim().split(/\r?\n/g);
          let globalConfig: GlobalConfig | null = null;
          let inCofnigTag = false;
          let curConfigArr = [];
          let curContentArr = [];
          let blocks = [];

          const append = () => {
            if (curContentArr.length) {
              let curConfig = globalConfig ? { ...globalConfig } : null;
              if (curConfigArr.length) {
                curConfig = yaml.load(curConfigArr.join("\n"));
                if (curConfig.global && !globalConfig) {
                  globalConfig = { ...curConfig };
                }
                delete curConfig.global;
              }
              blocks.push({
                config: { ...(globalConfig || {}), ...curConfig },
                content: [...curContentArr],
              });
              curConfigArr.length = 0;
              curContentArr.length = 0;
            }
          };

          lines.forEach((text) => {
            if (/^(#|##)\s/.test(text) || (text === "---" && inCofnigTag)) {
              append();
            }
            if (text === "---") {
              inCofnigTag = !inCofnigTag;
            } else {
              if (inCofnigTag) {
                curConfigArr.push(text);
              } else {
                curContentArr.push(text);
              }
            }
          });
          append();
          const html = blocks.map((block) => parseBlock(block)).join("");
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
