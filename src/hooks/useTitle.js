import { createSignal, createEffect, onCleanup } from "solid-js";
import { title as originalTitle } from "../metadata";

const [title, setTitle] = createSignal(originalTitle);
createEffect(() => {
  document.title = title();
});

export default function useTitle(overridedTitle = originalTitle) {
  setTitle(overridedTitle);
  onCleanup(() => setTitle(originalTitle));
}
