import { Box, ResponsiveContext, Text } from "grommet";
import React, { memo, useContext } from "react";
import { animated, useTransition } from "react-spring";
import styled from "styled-components";
import { usePart1Screen2Store } from "../store/Part1Screen2Store";
import { StackedBoxes } from "./StackedBoxes";

export const smallGridAreas = [
  { name: "stackedBoxes2006", start: [1, 0], end: [1, 0] },
  { name: "stackedBoxes2007", start: [1, 1], end: [1, 1] },
  { name: "stackedBoxes2010", start: [1, 2], end: [1, 3] },
  { name: "stackedBoxes2011", start: [1, 4], end: [1, 5] },
  { name: "stackedBoxes2012", start: [1, 6], end: [1, 6] },
  { name: "stackedBoxes2013", start: [1, 7], end: [1, 7] },
  { name: "text2006", start: [0, 0], end: [0, 0] },
  { name: "text2007", start: [0, 1], end: [0, 1] },
  { name: "text2010", start: [0, 2], end: [0, 3] },
  { name: "text2011", start: [0, 4], end: [0, 5] },
  { name: "text2012", start: [0, 6], end: [0, 6] },
  { name: "text2013", start: [0, 7], end: [0, 7] },
];
export const largeGridAreas = [
  { name: "stackedBoxes2006", start: [0, 0], end: [0, 0] },
  { name: "stackedBoxes2007", start: [1, 0], end: [1, 0] },
  { name: "stackedBoxes2010", start: [2, 0], end: [3, 0] },
  { name: "stackedBoxes2011", start: [4, 0], end: [5, 0] },
  { name: "stackedBoxes2012", start: [6, 0], end: [6, 0] },
  { name: "stackedBoxes2013", start: [7, 0], end: [7, 0] },
  { name: "text2006", start: [0, 1], end: [0, 1] },
  { name: "text2007", start: [1, 1], end: [1, 1] },
  { name: "text2010", start: [2, 1], end: [3, 1] },
  { name: "text2011", start: [4, 1], end: [5, 1] },
  { name: "text2012", start: [6, 1], end: [6, 1] },
  { name: "text2013", start: [7, 1], end: [7, 1] },
];
export const smallGridRows = [
  "flex",
  "flex",
  "flex",
  "flex",
  "flex",
  "flex",
  "flex",
  "flex",
];
export const smallGridColumns = ["auto", "flex"];
export const largeGridColumns = smallGridRows;
export const largeGridRows = [...smallGridColumns].reverse();

export const GridBoxes = memo(() => {
  const yearsShown = usePart1Screen2Store((state) => state.yearsShown);

  const isSmall = useContext(ResponsiveContext) === "small";

  const transition = useTransition([...yearsShown], {
    from: isSmall
      ? { opacity: 0, y: "0%", x: "20%" }
      : { opacity: 0, y: "-20%", x: "0%" },
    enter: { opacity: 1, y: "0%", x: "0%" },
    leave: { opacity: 0, y: "0%", x: "0%" },
  });

  return transition((style, year) => (
    <AnimatedBox
      key={year}
      style={style}
      gridArea={`stackedBoxes${year}`}
      align="center"
    >
      <StackedBoxes year={year} />
    </AnimatedBox>
  ));
});

GridBoxes.displayName = "GridBoxes";

export const GridTextLabels = memo(() => {
  const yearsShown = usePart1Screen2Store((state) => state.yearsShown);

  const transition = useTransition([...yearsShown], {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return transition((style, year) => (
    <AnimatedBox
      key={year}
      style={style}
      gridArea={`text${year}`}
      align="center"
      justify="center"
    >
      <StyledText
        size="24px"
        style={{ lineHeight: "72px" }}
        color="white"
        textAlign="center"
      >
        {year}
      </StyledText>
    </AnimatedBox>
  ));
});

GridTextLabels.displayName = "GridTextLabels";

const AnimatedBox = animated(Box);

const StyledText = styled(Text)`
  font-smooth: always !important;
  -webkit-font-smoothing: subpixel-antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility;
  user-select: none;
  backface-visibility: hidden;
`;
