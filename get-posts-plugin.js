import { join } from "path";
import { readdir, access, constants } from "fs/promises";

export default function getPostsPlugin() {
  const virtualModuleId = "virtual:get-posts";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  const postsDir = join(process.cwd(), "public", "_posts");
  const postPath = (p) => join(postsDir, p, "index.md");

  return {
    name: "get-posts",
    enforce: "pre",
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    async handleHotUpdate({ file, server }) {
      const isPostUpdated = file.match(/\/_posts\/(.*)\/.*$/);
      if (isPostUpdated) {
        const name = isPostUpdated[1];
        try {
          await access(postPath(name), constants.R_OK);
          server.ws.send({
            type: "custom",
            event: "post-update",
            data: {
              file,
              name,
            },
          });
        } catch {}
      }
      return [];
    },

    async load(id) {
      if (id === resolvedVirtualModuleId) {
        let rawPosts = await readdir(postsDir, { withFileTypes: true });
        rawPosts = rawPosts.filter((dirent) => dirent.isDirectory());
        const posts = [];
        for (const { name } of rawPosts) {
          try {
            await access(postPath(name), constants.R_OK);
            posts.push(name);
          } catch {
            continue;
          }
        }
        return `
          export const posts = new Set(${JSON.stringify(posts)});
        `;
      }
    },
  };
}
