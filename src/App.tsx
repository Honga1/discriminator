import { History } from "history";
import React, { lazy, Suspense } from "react";
import { Route, RouteProps, Router, Switch } from "react-router-dom";
import { PageContainer } from "./components/PageContainer";
import { Home } from "./plain/Home";
import { Permissions } from "./plain/Permissions";
import { Routes } from "./Routes";

const KnownRoute = (props: RouteProps & { path: Routes | Routes[] }) => (
  <Route {...props} />
);

const ChapterRouter = lazy(
  async () => import(/* webpackChunkName: "ChapterRouter" */ "./ChapterRouter")
);

function App({ history }: { history: History }) {
  return (
    <Router history={history}>
      <Switch>
        <KnownRoute exact path={"/"}>
          <PageContainer backgroundColor={"yellow"}>
            <Home />
          </PageContainer>
        </KnownRoute>
        <KnownRoute path={"/home"}>
          <PageContainer backgroundColor={"yellow"}>
            <Home />
          </PageContainer>
        </KnownRoute>
        <KnownRoute path={"/permissions"}>
          <PageContainer backgroundColor={"yellow"}>
            <Permissions />
          </PageContainer>
        </KnownRoute>

        <Route
          path={"/chapter/:chapterNumber"}
          render={(props) => (
            <PageContainer backgroundColor="black">
              <Suspense fallback={""}>
                <ChapterRouter {...props} />
              </Suspense>
            </PageContainer>
          )}
        ></Route>

        <Route>Missing Route</Route>
      </Switch>
    </Router>
  );
}

export default App;
