import { Box, Layer, Stack } from "grommet";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { ChapterNumbers, chapterNumbers, ChapterRoutes } from "../Routes";
import { useStore } from "../store/store";
import { Chapters } from "./chapters/Chapters";
import { Covers } from "./covers/Covers";

export const RouteChaptersAndCovers = () => {
  return (
    <>
      <Switch>
        {chapterNumbers.map((chapterNumber) => (
          <Route path={`/chapter/${chapterNumber}`} key={chapterNumber}>
            <ChaptersAndCovers
              chapterNumber={chapterNumber}
            ></ChaptersAndCovers>
          </Route>
        ))}
        <Route>
          <Redirect to="/error" />;
        </Route>
      </Switch>
    </>
  );
};

const ChaptersAndCovers = ({
  chapterNumber,
}: {
  chapterNumber: ChapterNumbers;
}) => {
  const history = useHistory();
  const isChapter = new URLSearchParams(useLocation().search).has("isChapter");
  const isCover = new URLSearchParams(useLocation().search).has("isCover");

  const isRecording = useStore(
    (state) => state.webcamStream instanceof MediaStream
  );

  if (!isCover && !isChapter) {
    history.push(`/chapter/${chapterNumber}?isCover` as ChapterRoutes);
  }

  return (
    <>
      <Layer modal={false} position="top-right" responsive={false}>
        <Stack>
          <Box>📷</Box>
          {!isRecording && <Box>❌</Box>}
        </Stack>
      </Layer>
      <Box
        fill
        style={{ display: isChapter ? "unset" : "none" }}
        className="MaybeHiddenChapter"
      >
        <Chapters chapterNumber={chapterNumber} />
      </Box>

      {!isChapter && <Covers chapterNumber={chapterNumber} />}
    </>
  );
};
