import md from "./intro.md?raw";
import { highlight } from "sugar-high";
import { marked } from "marked";
import "./index.css";
import "sugar-high-theme";

const root = document.getElementById("app");
console.log(md);
root.innerHTML = marked.parse(md, {
  highlight,
});
