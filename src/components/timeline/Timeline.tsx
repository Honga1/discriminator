import { Box, BoxProps, Text } from "grommet";
import React from "react";
import styled from "styled-components";
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

export const FadeColorText = styled(Text)<{ textColor: string }>`
  color: ${(props) => props.textColor};
  transition: color 0.4s;
`;
