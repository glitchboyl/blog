import { createSignal, createMemo, createEffect } from "solid-js";
import { useParams, useNavigate, A } from "@solidjs/router";
import usePosts from "./usePosts";

export default function Post() {
  const params = useParams();
  const { posts, store } = usePosts();
  const [post, setPost] = createSignal({});
  const postIndex = createMemo(() => posts().findIndex((p) => p === post()));
  const prevPost = createMemo(() =>
    postIndex() !== -1 && postIndex() > 0 ? posts()[postIndex() - 1] : null
  );
  const nextPost = createMemo(() =>
    postIndex() !== -1 && postIndex() < posts().length - 1
      ? posts()[postIndex() + 1]
      : null
  );

  createEffect(() => {
    if (!store.loading) {
      if (params.title in store()) {
        setPost(store()[params.title]);
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
        <A href="/">
          {">"}&nbsp;&nbsp;{"cd"}&nbsp;&nbsp;&nbsp;../
        </A>
      </p>
      <Show when={prevPost() !== null}>
        <p className="text-right">
          <A href={`/${prevPost().name}`}>
            {">"}&nbsp;&nbsp;{"cd"}&nbsp;&nbsp;&nbsp;{"#"}&nbsp;&nbsp;&nbsp;
            {prevPost().title}
          </A>
        </p>
      </Show>
      <Show when={nextPost() !== null}>
        <p className="text-right">
          <A href={`/${nextPost().name}`}>
            {">"}&nbsp;&nbsp;{"cd"}&nbsp;&nbsp;&nbsp;{"#"}&nbsp;&nbsp;&nbsp;
            {nextPost().title}
          </A>
        </p>
      </Show>
    </Show>
  );
}
