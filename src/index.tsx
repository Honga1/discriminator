import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { createBrowserHistory } from "history";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import WebFont from "webfontloader";
import "./index.css";
import PasswordChallenge from "./PasswordChallenge";
import { useStore } from "./store/store";

const history = createBrowserHistory({ basename: "/" });

Sentry.init({
  dsn: "https://c319fd0f15df4a699a1080de1256736e@o276055.ingest.sentry.io/5773593",
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
    }),
  ],

  tracesSampleRate: 0.2,
});

WebFont.load({
  custom: { families: ["Roboto"] },
});
const App = React.lazy(async () => import("./App"));

const Boarding = () => {
  const allowed = useStore((state) => state.allowed);
  localStorage.setItem("allowed", "true");

  console.log(allowed);

  if (allowed) {
    return (
      <Suspense fallback={"Loading.."}>
        <App history={history} />
      </Suspense>
    );
  } else {
    return <PasswordChallenge />;
  }
};

ReactDOM.render(
  <React.StrictMode>
    <Boarding />
  </React.StrictMode>,
  document.getElementById("root")
);
