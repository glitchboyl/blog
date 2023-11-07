import { createResource } from "solid-js";
import frontmatter from "frontmatter";
import markdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/nord.css";
import { posts as names } from "virtual:get-posts";

const md = markdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>
        `;
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

const [posts] = createResource(
  async () => {
    const db = await new Promise((resolve) => {
      const request = indexedDB.open("glitchboylsBlogDB");
      request.onupgradeneeded = () =>
        request.result.createObjectStore("posts", {
          keyPath: "name",
        });
      request.onsuccess = () => resolve(request.result);
    });

    const _posts = {};
    for (const name of names) {
      const post = await new Promise((resolve) => {
        const request = db
          .transaction("posts", "readonly")
          .objectStore("posts")
          .get(name);
        request.onsuccess = async () => {
          if (request.result) {
            resolve(request.result);
          } else {
            const rawPost = await (
              await fetch(`/posts/${name}/index.md`)
            ).text();
            const { data, content } = frontmatter(rawPost);
            const post = {
              name,
              ...data,
              content: md.render(content),
            };
            db.transaction("posts", "readwrite").objectStore("posts").add(post);
            resolve(post);
          }
        };
      });
      _posts[name] = post;
    }

    return _posts;
  },
  { initialValue: {} }
);

export default function usePosts() {
  return posts;
}
