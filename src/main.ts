import md from "./intro.md";
import { highlight } from 'sugar-high';
import { marked } from "marked";
import './index.css'

const root = document.getElementById("app");
marked.setOptions({
  highlight,
})
root.innerHTML = marked.parse(md);
