import { Box, BoxProps } from "grommet";
import React from "react";
import { ChapterIndicators } from "./ChapterIndicators";
import { ControlButtonRow } from "./ControlButtonRow";

export const Timeline = ({ ...props }: BoxProps) => {
  return (
    <Box gap="8px" {...props}>
      <ChapterIndicators />
      <ControlButtonRow />
    </Box>
  );
};
