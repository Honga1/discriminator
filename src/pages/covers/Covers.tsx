import { Box } from "grommet";
import React from "react";
import { Cover1 } from "./Cover1";
import { MediaContainer, MediaContent } from "./MediaContainer";

export const Cover = ({ chapterNumber }: { chapterNumber: number }) => {
  let cover;

  switch (chapterNumber) {
    case 1:
      cover = <Cover1 />;
      break;
    case 2:
      cover = <Cover1 />;
      break;
    case 3:
      cover = <Cover1 />;
      break;
    case 4:
      cover = <Cover1 />;
      break;
    default:
      cover = <Cover1 />;
      break;
  }

  return (
    <Box fill background="black" height={{ min: "396px" }}>
      <MediaContainer>
        <MediaContent>{cover}</MediaContent>
      </MediaContainer>
    </Box>
  );
};
