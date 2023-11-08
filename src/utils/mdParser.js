import frontmatter from "frontmatter";
import markdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/nord.css";

const md = markdownIt({
  html: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>
        `;
      } catch {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});
const imageRenderer = md.renderer.rules.image;
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  let src = token.attrs[token.attrIndex("src")][1];
  if (!src.startsWith("http")) {
    src = src.replace(/^(\.\/|\/)?/, "");
    token.attrs[token.attrIndex("src")][1] = `/posts/${
      src.startsWith("../") ? src.replace("../", "") : `${env}/${src}`
    }`;
  }
  return imageRenderer(tokens, idx, options, env, self);
};

export default function parser({ name, raw }) {
  const { data, content } = frontmatter(raw);
  return {
    name,
    ...data,
    content: md.render(content, name),
  };
}
