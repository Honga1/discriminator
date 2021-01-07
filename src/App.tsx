import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { PageContainer } from "./components/PageContainer";
import { About } from "./pages/About";
import { Chapters } from "./pages/chapters/Chapters";
import { Covers } from "./pages/chapters/Covers";
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
          <Route path="/chapter1">
            <Chapters chapterNumber={1} />
          </Route>
          <Route path="/chapter2">
            <Chapters chapterNumber={2} />
          </Route>
          <Route path="/chapter3">
            <Chapters chapterNumber={3} />
          </Route>
          <Route path="/chapter4">
            <Chapters chapterNumber={4} />
          </Route>
          <Route path="/chapter5">
            <Chapters chapterNumber={5} />
          </Route>
          <Route path="/cover0">
            <Redirect to="/"></Redirect>
          </Route>
          <Route path="/cover1">
            <Covers coverNumber={1} />
          </Route>
          <Route path="/cover2">
            <Covers coverNumber={2} />
          </Route>
          <Route path="/cover3">
            <Covers coverNumber={3} />
          </Route>
          <Route path="/cover4">
            <Covers coverNumber={4} />
          </Route>
          <Route path="/cover5">
            <Covers coverNumber={5} />
          </Route>
          <Route path="/cover6">
            <Redirect to="/end"></Redirect>
          </Route>
          <Route>
            Missing Route
            <Redirect to="/error"></Redirect>
          </Route>
        </Switch>
      </PageContainer>
    </BrowserRouter>
  );
}

export default App;
