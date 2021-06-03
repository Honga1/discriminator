import { Box, Text } from "grommet";
import React, { memo, Suspense, useEffect, useMemo } from "react";
import { animated, useSpring } from "react-spring";
import { PredictionsStore } from "src/store/PredictionsStore";
import { store } from "src/store/store";
import { colorTheme } from "src/theme";
import { useAnimationSequence } from "./chapter3/hooks/useAnimationSequence";

const Cover1 = React.lazy(async () => import("./chapter1/Cover1"));
const Cover2 = React.lazy(async () => import("./chapter2/Cover2"));
const Cover3 = React.lazy(async () => import("./chapter3/Cover3"));
const Cover4 = React.lazy(async () => import("./chapter4/Cover4"));
const Chapter1 = React.lazy(async () => import("./chapter1/Chapter1"));
const Chapter2 = React.lazy(async () => import("./chapter2/Chapter2"));
const Chapter3 = React.lazy(async () => import("./chapter3/Chapter3"));
const Chapter4 = React.lazy(async () => import("./chapter4/Chapter4"));

export const Chapter = memo(
  ({
    isCover,
    chapterNumber,
  }: {
    isCover: boolean;
    chapterNumber: 1 | 2 | 3 | 4;
  }) => {
    const [currentPage, stage] = useAnimationSequence([
      isCover,
      chapterNumber,
    ] as [boolean, 1 | 2 | 3 | 4]);

    useEffect(() => {
      store.setState({ pageAnimationState: stage });
    }, [stage]);
    useEffect(() => {
      PredictionsStore.pauseFor(700);
    }, [currentPage]);

    const [style] = useSpring(() => {
      if (stage === "ANIMATE_IN") {
        return { opacity: 1 };
      }
      if (stage === "ANIMATE_OUT") {
        return { opacity: 0 };
      }
    }, [stage]);

    const component = useMemo(
      () => getComponent(currentPage[0], currentPage[1]),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currentPage[0], currentPage[1]]
    );
    return (
      <Box fill flex={false} style={{ position: "relative" }}>
        <animated.div
          style={{
            ...style,
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
          }}
        >
          <Suspense
            fallback={<Text color={colorTheme.yellow}>Loading...</Text>}
          >
            {component}
          </Suspense>
        </animated.div>
      </Box>
    );
  }
);

Chapter.displayName = "Chapter";
function getComponent(isCover: boolean, chapterNumber: number) {
  let component;
  if (isCover) {
    switch (chapterNumber) {
      case 1:
        component = <Cover1 />;
        break;
      case 2:
        component = <Cover2 />;
        break;
      case 3:
        component = <Cover3 />;
        break;
      case 4:
        component = <Cover4 />;
        break;
    }
  } else {
    switch (chapterNumber) {
      case 1:
        component = <Chapter1 />;
        break;
      case 2:
        component = <Chapter2 />;
        break;
      case 3:
        component = <Chapter3 />;
        break;
      case 4:
        component = <Chapter4 />;
        break;
    }
  }
  return component;
}
