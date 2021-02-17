import React, { ReactElement } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { PageContainer } from "./components/PageContainer";
import { Chapter } from "./pages/chapters/Chapter";
import { Cover } from "./pages/covers/Cover";
import { EndPage } from "./pages/plain/EndPage";
import { Error } from "./pages/plain/Error";
import { Home } from "./pages/plain/Home";
import { HomeCoil } from "./pages/plain/HomeCoil";
import { Permission } from "./pages/plain/Permission";
import { PlainPageRoutes } from "./Routes";

const routeToComponent: { url: PlainPageRoutes; component: ReactElement }[] = [
  { url: "/", component: <Home /> },
  { url: "/cover", component: <Cover /> },
  { url: "/chapter", component: <Chapter /> },
  { url: "/home", component: <Home /> },
  { url: "/permissions", component: <Permission /> },
  { url: "/coil", component: <HomeCoil /> },
  { url: "/end", component: <EndPage /> },
  { url: "/error", component: <Error /> },
];

function App() {
  return (
    <HashRouter basename={"/"}>
      <PageContainer>
        <Switch>
          {routeToComponent.map(({ url, component }) => (
            <Route exact path={url} key={url}>
              {component}
            </Route>
          ))}
          <Route>Missing Route</Route>
        </Switch>
      </PageContainer>
    </HashRouter>
  );
}

export default App;
