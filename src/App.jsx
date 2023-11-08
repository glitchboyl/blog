import { A } from "@solidjs/router";
import usePosts from "./utils/usePosts";

export default function App() {
  const { posts } = usePosts();
  return (
    <>
      <div>
        <p>hi there,</p>
        <p>i am glitchboyl, a frontend engineer.</p>
        <p>School days. 📚</p>
      </div>
      <ul className="m-0 mt-4.5rem p-0 list-none text-right">
        <For each={posts()}>
          {({ name, title, date }) => (
            <li className="mt-1em mb-1em flex flex-col flex-items-end sm:flex-row sm:justify-end sm:flex-items-baseline">
              <A className="no-underline" href={name}>
                {"#"}&nbsp;&nbsp;&nbsp;{title}
              </A>
              <span className="sm:ml-1rem text-date">
                {new Date(date).toLocaleDateString("en", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </li>
          )}
        </For>
      </ul>
    </>
  );
}
