import { Box } from "grommet";
import React, { useEffect } from "react";
import { ChapterNumbers } from "../../Routes";
import { useStore } from "../../store/store";
import { Cover1 } from "./Cover1";
import { Cover2 } from "./Cover2";
import { Cover3 } from "./Cover3";
import { Cover4 } from "./Cover4";
import { Cover5 } from "./Cover5";

const covers = [<Cover1 />, <Cover2 />, <Cover3 />, <Cover4 />, <Cover5 />];

export const Covers = ({
  chapterNumber,
}: {
  chapterNumber: ChapterNumbers;
}) => {
  const coverIndex = parseInt(chapterNumber) - 1;

  const nextVideoToPlay = useStore((state) => state.nextVideoToPlay);

  useEffect(() => {
    if (!nextVideoToPlay) return;
    nextVideoToPlay.pause();
    nextVideoToPlay.currentTime = 0;
    nextVideoToPlay.load();
  }, [nextVideoToPlay]);

  if (Number.isInteger(coverIndex) && covers[coverIndex] !== undefined) {
    return (
      <Box fill justify="center" alignContent="center">
        {covers[coverIndex]}
      </Box>
    );
  } else {
    throw new Error(`Could not get chapter cover`);
  }
};
