import { ChangeEvent, useEffect, useState } from "react";
import { parse } from "../../core/parse";
import md from "../../src/intro.md";
import "../../src/default.css";

function App() {
  const [markdown, setMarkdown] = useState(md.trim());
  const [html, setHTML] = useState("");
  const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  useEffect(() => {
    let curHTML = html;
    try {
      curHTML = parse(markdown);
    } finally {
      setHTML(curHTML);
    }
  }, [markdown]);

  return (
    <div className="min-h-screen">
      <h1 className="text-center leading-loose font-mono text-xl p-8">
        Preview Your Resume With Markdown
      </h1>
      <div className="flex min-h-screen-sm">
        <textarea
          className="w-1/2 border-solid border-1 border-cyan-200"
          value={markdown}
          onChange={onTextAreaChange}
        ></textarea>
        <div
          className="w-1/2 border-solid border-1 border-cyan-200"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

export default App;
