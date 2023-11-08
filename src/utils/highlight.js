import { setCDN, getHighlighter } from "shiki";

let highlighter = null;
setCDN("https://cdn.jsdelivr.net/npm/shiki@0.14.5/");

export default async function highlight() {
  if (!highlighter) {
    highlighter = await getHighlighter({
      theme: "dracula",
      langs: [
        "c",
        "rust",
        "html",
        "css",
        "javascript",
        "jsx",
        "typescript",
        "tsx",
        "vue",
        "vue-html",
        "json",
        "shell",
        "bash",
        "sh",
        "zsh",
      ],
    });
  }
  return (code, lang) => highlighter.codeToHtml(code, { lang });
}
