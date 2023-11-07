import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <>
      <p>404 not found</p>
      <p className="text-right mt-4.5rem">
        <A className="text-hyperlink" href="/">{">"} &nbsp; cd /</A>
      </p>
    </>
  );
}
