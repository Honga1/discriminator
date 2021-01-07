import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { PageContainer } from "./components/PageContainer";
import { About } from "./pages/About";
import { Chapters } from "./pages/chapters/Chapters";
import { Covers } from "./pages/covers/Covers";
import { Credits } from "./pages/Credits";
import { EndPage } from "./pages/EndPage";
import { Error } from "./pages/Error";
import { Home } from "./pages/Home";
import { HomeCoil } from "./pages/HomeCoil";
import { Privacy } from "./pages/Privacy";

function App() {
  return (
    <BrowserRouter>
      <PageContainer>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/coil">
            <HomeCoil />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/credits">
            <Credits />
          </Route>
          <Route path="/end">
            <EndPage />
          </Route>
          <Route path="/error">
            <Error />
          </Route>
          <Route path="/privacy">
            <Privacy />
          </Route>
          {([1, 2, 3, 4, 5] as const).map((chapter) => (
            <Route path={`/chapter${chapter}`}>
              <Chapters chapterNumber={chapter} />
            </Route>
          ))}
          {([1, 2, 3, 4, 5] as const).map((cover) => (
            <Route path={`/cover${cover}`}>
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
