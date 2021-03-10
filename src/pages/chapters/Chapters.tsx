import { Box, Text } from "grommet";
import React, { Suspense } from "react";
import { Media } from "../covers/MediaContainer";

export const Chapter = ({
  hidden,
  chapterNumber,
}: {
  hidden: boolean;
  chapterNumber: 1 | 2 | 3 | 4;
}) => {
  let chapter;

  switch (chapterNumber) {
    case 1:
      const Chapter1 = React.lazy(async () => import("./Chapter1"));
      chapter = <Chapter1 />;
      break;
    case 2:
      const Chapter2 = React.lazy(async () => import("./Chapter2"));
      chapter = <Chapter2 />;
      break;
    case 3:
      const Chapter3 = React.lazy(async () => import("./Chapter3"));
      chapter = <Chapter3 />;
      break;
    case 4:
      const Chapter4 = React.lazy(async () => import("./Chapter4"));
      chapter = <Chapter4 />;
      break;
  }
  return (
    <Box fill style={hidden ? { display: "none" } : {}}>
      <Media>
        <Suspense fallback={<Text>Loading ...</Text>}>{chapter}</Suspense>
      </Media>
    </Box>
  );
};
