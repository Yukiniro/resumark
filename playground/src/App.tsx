import { ChangeEvent, useEffect, useRef, useState } from "react";
import { parse } from "../../core/parse";
import html2pdf from "html2pdf.js";
import md from "../../src/intro.md";
import "../../src/default.css";
import GitHubCorners from "@uiw/react-github-corners";

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
    html2pdf()
      .set({
        pagebreak: {
          mode: "avoid-all",
        },
        filename: "resume.pdf",
      })
      .from(html)
      .toPdf()
      .save()
      .catch((e: ErrorEvent) => {
        alert(e);
      });
  };

  useEffect(() => {
    let curHTML = html;
    parse(markdown, fetch)
      .then((parseHTML) => {
        setHTML(parseHTML);
      })
      .catch((e) => {
        console.log(e);
        setHTML(curHTML);
      });
  }, [markdown]);

  return (
    <div className="min-h-screen m-auto w-10/12">
      <GitHubCorners href="https://github.com/Yukiniro/resumark" />
      <h1 className="text-center leading-loose font-mono text-xl p-8">
        Preview Your Resume With Markdown
      </h1>
      <div className="flex justify-center py-4">
        <button onClick={resetOnClick} className="btn mx-2">
          Reset
        </button>
        <button onClick={exportOnClick} className="btn mx-2">
          Export to PDF
        </button>
      </div>
      <div className="flex justify-between min-h-screen-sm">
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
