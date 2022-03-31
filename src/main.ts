import md from "./intro.md";
import { marked } from "marked";

const root = document.getElementById("app");
root.innerHTML = marked.parse(md);
