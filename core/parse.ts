import yaml from "js-yaml";
import { marked } from "marked";
import { MainBlockConfig } from "./types";
import { isUndefined, isObject } from "bittydash";
import classNames from "classnames";

interface Block {
  config: MainBlockConfig;
  content: Array<string>;
}

function createStyleTextFromConfig(blockStyle: object | undefined) {
  return isObject(blockStyle)
    ? Object.keys(blockStyle)
        .map((key) => `${key}:${blockStyle[key]}`)
        .join(";")
    : "";
}

function parseBlock(block: Block) {
  const { config, content } = block;
  const nextContent = [...content];
  let html = marked.parse(nextContent.join("\n"));
  const { blockClassName, blockStyle, name, summary, avatarUrl, avatarShape } =
    config;
  let style = createStyleTextFromConfig(blockStyle);
  let className = classNames("re__block", blockClassName);
  if (isUndefined(name)) {
    html = `<div style="${style}" class="${className}">${html}</div>`;
  } else {
    className = classNames("re__personal", className);
    let avatarClassName = classNames(
      "re__avatar",
      avatarShape === "circle" && "re__avatar--circle"
    );
    html = `
        <div class="${className}">
          <div class="re__personal__info">
            <h1>${name}</h1>
            <span>${summary}</span>
          </div>
          <img class="${avatarClassName}" src=${avatarUrl} />
        </div>
      `.trim();
  }

  return html;
}

function parse(markdownText: string) {
  const lines = markdownText.trim().split(/\r?\n/g);
  let inCofnigTag = false;
  let curConfigArr = [];
  let curContentArr = [];
  let blocks = [];

  const append = () => {
    if (curContentArr.length) {
      let curConfig = null;
      if (curConfigArr.length) {
        curConfig = yaml.load(curConfigArr.join("\n"));
      }
      blocks.push({
        config: { ...curConfig },
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

  return blocks.map((block) => parseBlock(block)).join("");
}

export { parse };
