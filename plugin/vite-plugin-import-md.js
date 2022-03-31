const fileRegex = /\.(md)$/;

function toJS(src, id) {
  if (!id.endsWith(".md")) {
    return null;
  }

  return `
  const content = \`${src.replace(/`/g, "\\`")}\`;
  export default content;
  `;
}

export function md() {
  return {
    name: "vite-plugin-import-md",
    transform: function (src, id) {
      if (fileRegex.test(id)) {
        return {
          code: toJS(src, id),
          map: null, // 如果可行将提供 source map
        };
      }
    },
  };
}
