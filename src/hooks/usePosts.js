import { createResource } from "solid-js";
import parser from "../utils/mdParser";
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

    return await new Promise((resolve) => {
      const request = db
        .transaction("posts", "readonly")
        .objectStore("posts")
        .getAll();
      request.onsuccess = () => {
        const dbStore = Object.fromEntries(
          request.result.map((post) => [post.name, post])
        );
        resolve(dbStore);
        update(dbStore);
      };
    });
  },
  { initialValue: {} }
);
const posts = () =>
  Object.values(store()).sort(
    (a, b) => Date.parse(b.date) - Date.parse(a.date)
  );

async function fetchPost(name) {
  try {
    const rawPost = await fetch(`./_posts/${name}/index.md`);
    if (rawPost.ok) {
      const post = await parser({
        name,
        raw: await rawPost.text(),
      });
      return post;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function update(dbStore) {
  const _store = { ...dbStore };
  for (const name of new Set([...Object.keys(dbStore), ...names])) {
    if (!names.has(name)) {
      db.transaction("posts", "readonly").objectStore("posts").delete(name);
      delete _store[name];
    } else {
      const originalPost = dbStore[name];
      const post = await fetchPost(name);
      if (
        !originalPost ||
        originalPost.title !== post.title ||
        originalPost.content !== originalPost.content ||
        originalPost.date !== post.date
      ) {
        db.transaction("posts", "readwrite").objectStore("posts").put(post);
        _store[name] = post;
      }
    }
  }
  mutate(_store);
}

if (import.meta.hot) {
  import.meta.hot.on("post-update", async ({ file, name }) => {
    if (
      (file.endsWith(".md") && file.endsWith("/index.md")) ||
      !file.endsWith(".md")
    ) {
      const post = await fetchPost(name);
      db.transaction("posts", "readwrite").objectStore("posts").put(post);
      mutate({ ...store(), [name]: post });
    }
  });
}

export default function usePosts() {
  return { posts, store };
}
