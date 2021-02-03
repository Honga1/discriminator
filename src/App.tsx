import { ReactElement } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { PageContainer } from "./components/PageContainer";
import { RouteChaptersAndCovers } from "./pages/ChaptersAndCovers";
import { About } from "./pages/plain/About";
import { Credits } from "./pages/plain/Credits";
import { EndPage } from "./pages/plain/EndPage";
import { Error } from "./pages/plain/Error";
import { Home } from "./pages/plain/home/Home";
import { HomeCoil } from "./pages/plain/HomeCoil";
import { Privacy } from "./pages/plain/Privacy";
import { PlainPageRoutes } from "./Routes";

const routeToComponent: { url: PlainPageRoutes; component: ReactElement }[] = [
  { url: "/", component: <Home /> },
  { url: "/home", component: <Home /> },
  { url: "/coil", component: <HomeCoil /> },
  { url: "/about", component: <About /> },
  { url: "/credits", component: <Credits /> },
  { url: "/end", component: <EndPage /> },
  { url: "/error", component: <Error /> },
  { url: "/privacy", component: <Privacy /> },
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
          <Route path={`/chapter`} component={RouteChaptersAndCovers} />
          <Route>Missing Route</Route>
        </Switch>
      </PageContainer>
    </HashRouter>
  );
}

export default App;
