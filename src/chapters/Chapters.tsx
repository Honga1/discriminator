import { useTransition } from "@react-spring/core";
import { Box, Text } from "grommet";
import React, { memo, Suspense, useMemo } from "react";
import { animated } from "react-spring";
import { PredictionsStore } from "src/store/PredictionsStore";

const Cover4 = React.lazy(async () => import("./chapter4/Cover4"));
const Cover2 = React.lazy(async () => import("./chapter2/Cover2"));
const Cover3 = React.lazy(async () => import("./chapter3/Cover3"));
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
    const transitionTrigger = useMemo(() => {
      PredictionsStore.pauseFor(700);
      return { isCover, chapterNumber };
    }, [chapterNumber, isCover]);
    const transition = useTransition(transitionTrigger, {
      from: { opacity: 0 },
      enter: { opacity: 1, delay: 200 },
      leave: { opacity: 0 },
    });

    return (
      <Box fill flex={false} style={{ position: "relative" }}>
        {transition((style, { isCover, chapterNumber }) => {
          let component;
          if (isCover) {
            switch (chapterNumber) {
              case 1:
                throw new Error("No cover for chapter 1");
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
          return (
            <animated.div
              style={{
                ...style,
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
              }}
            >
              <Suspense fallback={<Text>Loading...</Text>}>
                {component}
              </Suspense>
            </animated.div>
          );
        })}
      </Box>
    );
  }
);

Chapter.displayName = "Chapter";
