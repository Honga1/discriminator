import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { PageContainer } from "./components/PageContainer";
import { ChaptersAndCovers } from "./pages/ChaptersAndCovers";
import { About } from "./pages/plain/About";
import { Credits } from "./pages/plain/Credits";
import { EndPage } from "./pages/plain/EndPage";
import { Error } from "./pages/plain/Error";
import { Home } from "./pages/plain/Home";
import { HomeCoil } from "./pages/plain/HomeCoil";
import { PlainPageContainer } from "./pages/plain/PlainPagesContainer";
import { Privacy } from "./pages/plain/Privacy";

const plainPageRoutes = [
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
          <Route exact path="/">
            <PlainPageContainer>
              <Home />
            </PlainPageContainer>
          </Route>
          {plainPageRoutes.map(({ url, component }) => (
            <Route path={url} key={url}>
              <PlainPageContainer>{component}</PlainPageContainer>
            </Route>
          ))}
          <Route path={`/chapter`} component={ChaptersAndCovers} />
          <Route path="/cover0">
            <Redirect to="/"></Redirect>
          </Route>
          <Route path="/cover6">
            <Redirect to="/end"></Redirect>
          </Route>
          <Route>Missing Route</Route>
        </Switch>
      </PageContainer>
    </HashRouter>
  );
}

export default App;
