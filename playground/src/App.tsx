import { ChangeEvent, useEffect, useRef, useState } from "react";
import { parse } from "../../core/parse";
import pdf from "html-pdf";
import md from "../../src/intro.md";
import "../../src/default.css";

function App() {
  const initValueRef = useRef(md.trim());
  const [markdown, setMarkdown] = useState(initValueRef.current);
  const [html, setHTML] = useState("");
  const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const resetOnClick = () => {
    setMarkdown(initValueRef.current);
  };
  const exportOnClick = () => {
    console.log('export');
    pdf.create(html).toFile("./resume.pdf", function (err: ErrorEvent) {
      if (err) {
        alert("Export Fail");
      } else {
        alert("Export Success");
      }
    });
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
      <div className="flex justify-center py-4">
        <button onClick={resetOnClick} className="btn mx-2">
          Reset
        </button>
        <button onClick={exportOnClick} className="btn mx-2">
          Export
        </button>
      </div>
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
