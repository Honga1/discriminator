import { Box } from "grommet";
import { PropsWithChildren } from "react";
import { ChapterButtons } from "./ChapterButtons";

export const ChapterContainer = ({
  children,
  chapterNumber,
}: PropsWithChildren<{ chapterNumber: number }>) => {
  return (
    <Box>
      <ChapterButtons chapterNumber={chapterNumber} />
      {children}
    </Box>
  );
};
