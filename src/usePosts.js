import { createResource } from "solid-js";
import frontmatter from "frontmatter";
import markdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/nord.css";
import { posts as names } from "virtual:get-posts";

let db;
const md = markdownIt({
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

const fetchPost = async (name) => {
  try {
    let rawPost = await fetch(`/posts/${name}/index.md`);
    if (rawPost.ok) {
      rawPost = await rawPost.text();
      const { data, content } = frontmatter(rawPost);
      return {
        name,
        ...data,
        content: md.render(content),
      };
    }
  } catch {}
  return null;
};

const getPost = (name) =>
  new Promise((resolve) => {
    const request = db
      .transaction("posts", "readonly")
      .objectStore("posts")
      .get(name);

    request.onsuccess = async () => {
      if (request.result) {
        resolve(request.result);
        updatePost(request.result);
      } else {
        const post = await fetchPost(name);
        if (post) {
          db.transaction("posts", "readwrite").objectStore("posts").add(post);
        }
        resolve(post);
      }
    };
  });

const updatePost = async ({ name, title, date, content }) => {
  const post = await fetchPost(name);
  if (
    post &&
    (post.content !== content || post.title !== title || post.date !== date)
  ) {
    db.transaction("posts", "readwrite").objectStore("posts").put(post);
    mutate({ ...posts(), [name]: post });
  }
};

const [posts, { mutate }] = createResource(
  async () => {
    db = await new Promise((resolve) => {
      const request = indexedDB.open("glitchboylsBlogDB");
      request.onupgradeneeded = () =>
        request.result.createObjectStore("posts", {
          keyPath: "name",
        });
      request.onsuccess = () => resolve(request.result);
    });

    const postStore = {};
    for (const name of names) {
      const post = await getPost(name);
      postStore[name] = post;
    }

    return postStore;
  },
  { initialValue: {} }
);

if (import.meta.hot) {
  import.meta.hot.on("post-update", ({ file, name }) => {
    if (
      (file.endsWith(".md") && file.endsWith("/index.md")) ||
      !file.endsWith(".md")
    ) {
      getPost(name);
    }
  });
}

export default function usePosts() {
  return posts;
}
