import React from "react";
import {
  HashRouter,
  Route,
  RouteComponentProps,
  RouteProps,
  Switch,
} from "react-router-dom";
import { PageContainer } from "./components/PageContainer";
import { Chapter } from "./pages/chapters/Chapter";
import { Cover } from "./pages/covers/Cover";
import { Home } from "./pages/plain/Home";
import { Permission } from "./pages/plain/Permission";
import {
  parseChapterNumber,
  parsePageTypeQuery,
  Routes,
  validateChapterNumber,
  validatePageTypeQuery,
} from "./Routes";

const KnownRoute = (props: RouteProps & { path: Routes | Routes[] }) => (
  <Route {...props} />
);

function App() {
  return (
    <HashRouter basename={"/"}>
      <Switch>
        <KnownRoute exact path={"/"}>
          <PageContainer backgroundColor={"yellow"}>
            <Home />
          </PageContainer>
        </KnownRoute>
        <KnownRoute path={["/home", "/coil"]}>
          <PageContainer backgroundColor={"yellow"}>
            <Home />
          </PageContainer>
        </KnownRoute>
        <KnownRoute path={"/permissions"}>
          <PageContainer backgroundColor={"yellow"}>
            <Permission />
          </PageContainer>
        </KnownRoute>

        <Route
          path={"/chapter/:chapterNumber"}
          render={(props) => (
            <PageContainer backgroundColor="black">
              <ChapterRouter {...props} />
            </PageContainer>
          )}
        ></Route>

        <Route>Missing Route</Route>
      </Switch>
    </HashRouter>
  );
}

const ChapterRouter = ({ match, history, location }: RouteComponentProps) => {
  const maybeChapterNumber = (match.params as any)["chapterNumber"] as
    | string
    | undefined;
  const isValidChapterNumber = validateChapterNumber(maybeChapterNumber);

  if (!isValidChapterNumber) {
    history.push(`/chapter/1?type=cover`);
  }

  const query = new URLSearchParams(location.search);
  const isValidQuery = validatePageTypeQuery(query);

  if (!isValidQuery) {
    history.push(`${match.url}?type=cover`);
  }

  if (!isValidQuery || !isValidChapterNumber) return null;

  const chapterNumber = parseChapterNumber(maybeChapterNumber);
  const type = parsePageTypeQuery(query);
  return (
    <>
      <Chapter hidden={type !== "chapter"} chapterNumber={chapterNumber} />
      {type === "cover" && <Cover chapterNumber={chapterNumber} />}
    </>
  );
};

export default App;
