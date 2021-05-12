import { Box, Text } from "grommet";
import React, { Suspense } from "react";
import { Media } from "../components/MediaContainer";

const Cover4 = React.lazy(async () => import("./chapter4/Cover4"));
const Cover3 = React.lazy(async () => import("./chapter3/Cover3"));

const Chapter1 = React.lazy(async () => import("./chapter1/Chapter1"));
const Chapter2 = React.lazy(async () => import("./chapter2/Chapter2"));
const Chapter3 = React.lazy(async () => import("./chapter3/Chapter3"));
const Chapter4 = React.lazy(async () => import("./chapter4/Chapter4"));

export const Chapter = ({
  isCover,
  chapterNumber,
}: {
  isCover: boolean;
  chapterNumber: 1 | 2 | 3 | 4;
}) => {
  let pair;
  switch (chapterNumber) {
    case 1:
      pair = <CoverChapterPair isCover={isCover} chapter={<Chapter1 />} />;
      break;
    case 2:
      pair = <Chapter2 isCover={isCover} />;
      break;
    case 3:
      pair = (
        <CoverChapterPair
          isCover={isCover}
          chapter={<Chapter3 />}
          cover={<Cover3 />}
        />
      );
      break;
    case 4:
      pair = (
        <CoverChapterPair
          isCover={isCover}
          chapter={<Chapter4 />}
          cover={<Cover4 />}
        />
      );
      break;
  }
  return <Suspense fallback={<Text>Loading...</Text>}>{pair}</Suspense>;
};

const CoverChapterPair = ({
  isCover,
  chapter,
  cover,
}: {
  isCover: boolean;
  chapter: JSX.Element;
  cover?: JSX.Element;
}) => {
  return (
    <Media>
      <Box fill style={isCover ? { display: "none" } : {}}>
        {chapter}
      </Box>
      {isCover && cover}
    </Media>
  );
};
