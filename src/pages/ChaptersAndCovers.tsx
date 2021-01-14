import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { Chapters } from "./chapters/Chapters";
import { Covers } from "./covers/Covers";

export const ChaptersAndCovers = () => {
  const isBody = new URLSearchParams(useLocation().search).has("body");

  return (
    <>
      <Switch>
        {([1, 2, 3, 4, 5] as const).map((cover) => (
          <Route path={`/chapter/${cover}`} key={cover}>
            {isBody && <Chapters chapterNumber={cover} />}
            {!isBody && <Covers coverNumber={cover} />}
          </Route>
        ))}
        <Route>
          <Redirect to="/error" />;
        </Route>
      </Switch>
    </>
  );
};
