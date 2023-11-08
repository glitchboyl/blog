import { createResource, createMemo } from "solid-js";
import parser from "./mdParser";
import { posts as names } from "virtual:get-posts";

let db;
const [store, { mutate }] = createResource(
  async () => {
    db = await new Promise((resolve) => {
      const request = indexedDB.open("glitchboylsBlogDB");
      request.onupgradeneeded = () =>
        request.result.createObjectStore("posts", {
          keyPath: "name",
        });
      request.onsuccess = () => resolve(request.result);
    });

    const _store = {};
    for (const name of names) {
      const post = await getPost(name);
      _store[name] = post;
    }

    return _store;
  },
  { initialValue: {} }
);

const fetchPost = async (name) => {
  try {
    const rawPost = await fetch(`/posts/${name}/index.md`);
    if (rawPost.ok) {
      return parser({
        name,
        raw: await rawPost.text(),
      });
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
    mutate({ ...store(), [name]: post });
  }
};

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
  const posts = createMemo(() =>
    Object.values(store()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  );
  return { posts, store };
}
