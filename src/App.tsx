import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { PageContainer } from "./components/PageContainer";
import { About } from "./pages/plain/About";
import { Chapters } from "./pages/chapters/Chapters";
import { Covers } from "./pages/covers/Covers";
import { Credits } from "./pages/plain/Credits";
import { EndPage } from "./pages/plain/EndPage";
import { Error } from "./pages/plain/Error";
import { Home } from "./pages/plain/Home";
import { HomeCoil } from "./pages/plain/HomeCoil";
import { Privacy } from "./pages/plain/Privacy";
import { PlainPageContainer } from "./pages/plain/PlainPagesContainer";

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
    <BrowserRouter>
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
          {([1, 2, 3, 4, 5] as const).map((chapter) => (
            <Route path={`/chapter${chapter}`} key={chapter}>
              <Chapters chapterNumber={chapter} />
            </Route>
          ))}
          {([1, 2, 3, 4, 5] as const).map((cover) => (
            <Route path={`/cover${cover}`} key={cover}>
              <Covers coverNumber={cover} />
            </Route>
          ))}

          <Route path="/cover0">
            <Redirect to="/"></Redirect>
          </Route>
          <Route path="/cover6">
            <Redirect to="/end"></Redirect>
          </Route>
          <Route>Missing Route</Route>
        </Switch>
      </PageContainer>
    </BrowserRouter>
  );
}

export default App;
