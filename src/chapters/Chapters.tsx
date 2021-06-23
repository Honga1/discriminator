import { Box, Text } from "grommet";
import React, { lazy, memo, Suspense, useEffect, useMemo } from "react";
import { animated, to, useSpring } from "react-spring";
import { PredictionsStore } from "src/store/PredictionsStore";
import { store, useStore } from "src/store/store";
import { colorTheme } from "src/theme";
import { useAnimationSequence } from "./chapter3/hooks/useAnimationSequence";
import cursor from "src/images/cursor.png";

const Cover1 = lazy(
  async () => import(/* webpackChunkName: "Cover1" */ "./chapter1/Cover1")
);
const Cover2 = lazy(
  async () => import(/* webpackChunkName: "Cover2" */ "./chapter2/cover/Cover2")
);
const Cover3 = lazy(
  async () => import(/* webpackChunkName: "Cover3" */ "./chapter3/Cover3")
);
const Cover4 = lazy(
  async () => import(/* webpackChunkName: "Cover4" */ "./chapter4/cover/Cover4")
);
const Chapter1 = lazy(
  async () => import(/* webpackChunkName: "Chapter1" */ "./chapter1/Chapter1")
);
const Chapter2 = lazy(
  async () => import(/* webpackChunkName: "Chapter2" */ "./chapter2/Chapter2")
);
const Chapter3 = lazy(
  async () => import(/* webpackChunkName: "Chapter3" */ "./chapter3/Chapter3")
);
const Chapter4 = lazy(
  async () =>
    import(/* webpackChunkName: "Chapter4" */ "./chapter4/chapter/Chapter4")
);

export const Chapter = memo(
  ({
    isCover,
    chapterNumber,
  }: {
    isCover: boolean;
    chapterNumber: 1 | 2 | 3 | 4;
  }) => {
    const [[currentPageIsCover, currentPage], stage] = useAnimationSequence([
      isCover,
      chapterNumber,
    ] as [boolean, 1 | 2 | 3 | 4]);

    useEffect(() => {
      store.setState({ pageAnimationState: stage });
    }, [stage]);
    useEffect(() => {
      PredictionsStore.pauseFor(700);

      if (currentPageIsCover) {
        store.getState().chapter?.pause();
        store.getState().chapter?.rewind();
      }
    }, [currentPage, currentPageIsCover]);

    const [style] = useSpring(() => {
      if (stage === "ANIMATE_IN") {
        return { opacity: 1 };
      }
      if (stage === "ANIMATE_OUT") {
        return { opacity: 0 };
      }
    }, [stage]);

    const { cover, chapter } = useMemo(
      () => getComponent(currentPage),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currentPage]
    );

    const hasWebcamStream = useStore(
      (state) => state.webcamStream !== undefined
    );

    return (
      <Box fill flex={false} style={{ position: "relative" }}>
        <Suspense fallback={<Text color={colorTheme.yellow}>Loading...</Text>}>
          <animated.div
            style={{
              opacity: to([style.opacity], (opacity) =>
                currentPageIsCover ? 0 : opacity
              ),
              width: "100%",
              height: "100%",
              position: "absolute",
              pointerEvents: currentPageIsCover ? "none" : "auto",
              top: 0,
            }}
          >
            {chapter}
          </animated.div>
          {currentPageIsCover && (
            <animated.div
              style={{
                opacity: style.opacity,
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                cursor: !hasWebcamStream ? `url(${cursor}), auto` : "auto",
              }}
            >
              {cover}
            </animated.div>
          )}
        </Suspense>
      </Box>
    );
  }
);

Chapter.displayName = "Chapter";
function getComponent(chapterNumber: 1 | 2 | 3 | 4) {
  let cover;
  let chapter;
  switch (chapterNumber) {
    case 1:
      cover = <Cover1 />;
      break;
    case 2:
      cover = <Cover2 />;
      break;
    case 3:
      cover = <Cover3 />;
      break;
    case 4:
      cover = <Cover4 />;
      break;
  }

  switch (chapterNumber) {
    case 1:
      chapter = <Chapter1 />;
      break;
    case 2:
      chapter = <Chapter2 />;
      break;
    case 3:
      chapter = <Chapter3 />;
      break;
    case 4:
      chapter = <Chapter4 />;
      break;
  }
  return { cover, chapter };
}
