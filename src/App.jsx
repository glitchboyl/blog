import { createMemo } from "solid-js";
import { A } from "@solidjs/router";
import usePosts from "./usePosts";

export default function App() {
  const posts = usePosts();
  const postList = createMemo(() =>
    Object.values(posts()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  );
  return (
    <>
      <div>
        <p>hi there,</p>
        <p>i am glitchboyl, a frontend engineer.</p>
        <p>School days. 📚</p>
      </div>
      <ul className="m-0 mt-4.5rem p-0 list-none text-right">
        <For each={postList()}>
          {({ name, title, date }) => (
            <li className="mt-1em mb-1em flex flex-col flex-items-end sm:flex-row sm:justify-end sm:flex-items-baseline">
              <A className="no-underline" href={name}>
                {"#"} &nbsp; {title}
              </A>
              <span className="ml-1rem text-date">{date}</span>
            </li>
          )}
        </For>
      </ul>
    </>
  );
}
