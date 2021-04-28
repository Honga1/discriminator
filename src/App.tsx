import React, { useEffect } from "react";
import {
  HashRouter,
  Route,
  RouteComponentProps,
  RouteProps,
  Switch,
} from "react-router-dom";
import { PageContainer } from "./components/PageContainer";
import { Chapter } from "./chapters/Chapters";
import { Cover } from "./covers/Covers";
import { Home } from "./plain/Home";
import { Permission } from "./plain/Permission";
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

  useEffect(() => {
    const isValidChapterNumber = validateChapterNumber(maybeChapterNumber);
    if (!isValidChapterNumber) {
      history.replace(`/chapter/1?type=chapter`);
      return;
    }

    const chapterNumber = parseChapterNumber(maybeChapterNumber);
    const query = new URLSearchParams(location.search);
    const isValidQuery = validatePageTypeQuery(query, chapterNumber);

    if (!isValidQuery) {
      history.replace(
        `${match.url}?type=${chapterNumber === 1 ? "chapter" : "cover"}`
      );
      return;
    }
  }, [history, location.search, match.url, maybeChapterNumber]);

  const isValidChapterNumber = validateChapterNumber(maybeChapterNumber);
  if (!isValidChapterNumber) return null;
  const chapterNumber = parseChapterNumber(maybeChapterNumber);
  const query = new URLSearchParams(location.search);
  const isValidQuery = validatePageTypeQuery(query, chapterNumber);

  if (!isValidQuery) return null;

  const type = parsePageTypeQuery(query, chapterNumber);
  return (
    <>
      <Chapter hidden={type !== "chapter"} chapterNumber={chapterNumber} />
      {type === "cover" && <Cover chapterNumber={chapterNumber} />}
    </>
  );
};

export default App;
