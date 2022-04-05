import md from "./intro.md";
import { highlight } from "sugar-high";
import { marked } from "marked";
import "./index.css";
import "sugar-high-theme";

const root = document.getElementById("app");
root.innerHTML = marked.parse(md, {
  highlight,
});