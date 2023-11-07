import { createSignal, createEffect } from "solid-js";
import { useParams, useNavigate, A } from "@solidjs/router";
import usePosts from "./usePosts";

export default function Post() {
  const params = useParams();
  const posts = usePosts();
  const [post, setPost] = createSignal({});

  createEffect(() => {
    if (!posts.loading) {
      if (params.title in posts()) {
        setPost(posts()[params.title]);
      } else {
        const navigate = useNavigate();
        navigate("/404", { replace: true });
      }
    }
  });

  return (
    <Show when={!posts.loading}>
      <h2>{post().title}</h2>
      <p className="text-date">{post().date}</p>
      <div className="mt-4.5rem" innerHTML={post().content} />
      <p className="text-right mt-4.5rem">
        <A href="/">{">"} &nbsp; cd /</A>
      </p>
    </Show>
  );
}
