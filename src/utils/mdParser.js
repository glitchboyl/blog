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

const handlePostLink = (link, env) => {
  if (!link.startsWith("http")) {
    link = link.replace(/^(\.\/|\/)?/, "");
    return `/posts/${
      link.startsWith("../") ? link.replace("../", "") : `${env}/${link}`
    }`;
  }
  return link;
};

const { image: imageRenderer, html_block: htmlBlockRenderer } =
  md.renderer.rules;

md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  token.attrs[token.attrIndex("src")][1] = handlePostLink(
    token.attrs[token.attrIndex("src")][1],
    env
  );
  return imageRenderer(tokens, idx, options, env, self);
};
const temp = document.createElement("temp");
md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
  temp.innerHTML = tokens[idx].content;
  const block = temp.querySelector("[src]");
  if (block) {
    block.setAttribute("src", handlePostLink(block.getAttribute("src"), env));
    tokens[idx].content = temp.innerHTML;
  }
  return htmlBlockRenderer(tokens, idx, options, env, self);
};

export default function parser({ name, raw }) {
  const { data, content } = frontmatter(raw);
  return {
    name,
    ...data,
    content: md.render(content, name),
  };
}
