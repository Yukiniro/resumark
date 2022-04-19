import yaml from "js-yaml";
import { marked } from "marked";
import { Fetch, MainBlockConfig } from "./types";
import { isUndefined } from "bittydash";
import classNames from "classnames";
import { addCache, getCache, hasCache } from "./cache";

interface Block {
  config: MainBlockConfig;
  content: Array<string>;
}

interface BlockStyle {
  [key: string]: string | number;
}

let globalBlockStyle: string | object | undefined;
let globalBlockClassName: string | undefined;

function createStyleTextFromConfig(blockStyle: BlockStyle = {}) {
  return Object.keys(blockStyle)
    .map((key) => {
      return `${key}:${blockStyle[key]}`;
    })
    .join("; ");
}

async function parseBlock(block: Block, fetch: Fetch) {
  const { config, content } = block;
  const nextContent = [...content];
  let html = marked.parse(nextContent.join("\n"));
  const { blockClassName, blockStyle, name, summary, avatarUrl, avatarShape } =
    config;
  globalBlockStyle = blockStyle || globalBlockStyle;
  globalBlockClassName = blockClassName || globalBlockClassName;
  let style = createStyleTextFromConfig((globalBlockStyle || {}) as BlockStyle);
  let className = classNames("re__block", globalBlockClassName);
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
          <img class="${avatarClassName}" src="${avatarUrl}" />
        </div>
      `.trim();
  }

  const items = [...html.matchAll(/(src=\")\S+\"/g)];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const index = html.indexOf(item[0]);
    const start = index + 5;
    const end = index + item[0].length - 1;
    const srcValue = html.slice(start, end);
    let baseValue = "";
    if (hasCache(srcValue)) {
      baseValue = getCache(srcValue);
    } else {
      baseValue = await addCache(srcValue, fetch);
    }
    html = `${html.slice(0, start)}${baseValue}${html.slice(end)}`;
  }

  return html;
}

async function parse(markdownText: string, fetch: Fetch) {
  const lines = markdownText.trim().split(/\r?\n/g);
  let inCofnigTag = false;
  let curConfigArr: Array<string> = [];
  let curContentArr: Array<string> = [];
  let blocks: Array<Block> = [];

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

  let htmlArr = [];
  for (let i = 0; i < blocks.length; i++) {
    htmlArr.push(await parseBlock(blocks[i], fetch));
  }

  return `
    <div class="re__container">
      ${htmlArr.join("")}
    </div>
  `;
}

export { parse };
