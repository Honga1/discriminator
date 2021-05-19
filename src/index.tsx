import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { createHashHistory } from "history";
import React from "react";
import ReactDOM from "react-dom";
import * as WebFont from "webfontloader";
import App from "./App";
import "./index.css";

const history = createHashHistory({ basename: "/" });

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

ReactDOM.render(
  <React.StrictMode>
    <App history={history} />
  </React.StrictMode>,
  document.getElementById("root")
);
