import { render } from "solid-js/web";
import { Router, Route, Routes, hashIntegration } from "@solidjs/router";
import { lazy } from "solid-js";

import "virtual:uno.css";

const App = lazy(() => import("./App"));
const Post = lazy(() => import("./Post"));
const NotFound = lazy(() => import("./NotFound"));

render(
  () => (
    <div className="text-primary max-w-42rem m-auto mt-6.75rem mb-8rem px-1.25rem">
      <Router source={hashIntegration()}>
        <Routes>
          <Route path="/" component={App} />
          <Route path="/404" component={NotFound} />
          <Route path="/:title" component={Post} />
        </Routes>
      </Router>
    </div>
  ),
  document.getElementById("root")
);
