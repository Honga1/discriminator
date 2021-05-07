import { Box, ResponsiveContext, Text } from "grommet";
import React, { memo, useContext } from "react";
import { animated, useTransition } from "react-spring";
import { colorTheme } from "src/theme";
import styled from "styled-components";
import { Tinting } from "../../Part1Screen2/store/Part1Screen2Store";
import { usePart3Store } from "../store/Part3Store";
import { PiledBoxes } from "./PiledBoxes";

export const smallGridAreas = [
  { name: "stackedBoxes-wedding", start: [0, 0], end: [0, 0] },
  { name: "text-party", start: [0, 1], end: [0, 1] },
  { name: "stackedBoxes-party", start: [0, 2], end: [0, 2] },
  { name: "text-wedding", start: [0, 3], end: [0, 3] },
  { name: "stackedBoxes-family", start: [0, 4], end: [0, 4] },
  { name: "text-family", start: [0, 5], end: [0, 5] },
];
export const largeGridAreas = [
  { name: "text-wedding", start: [0, 0], end: [0, 0] },
  { name: "stackedBoxes-wedding", start: [0, 1], end: [0, 2] },
  { name: "stackedBoxes-party", start: [1, 0], end: [1, 1] },
  { name: "text-party", start: [1, 2], end: [1, 2] },
  { name: "text-family", start: [2, 0], end: [2, 0] },
  { name: "stackedBoxes-family", start: [2, 1], end: [2, 2] },
];
export const smallGridRows = ["flex", "flex", "flex", "flex", "flex", "flex"];
export const smallGridColumns = ["flex"];
export const largeGridColumns = ["flex", "flex", "flex"];
export const largeGridRows = ["1/4", "auto", "1/4"];

export const PileBoxes = memo(() => {
  const isSmall = useContext(ResponsiveContext) === "small";
  const tinting = usePart3Store((state) => state.tinting);

  const transition = useTransition([...tinting], {
    from: isSmall
      ? { opacity: 0, y: "0%", x: "20%" }
      : { opacity: 0, y: "-20%", x: "0%" },
    enter: { opacity: 1, y: "0%", x: "0%" },
    leave: { opacity: 0, y: "0%", x: "0%" },
  });

  return transition((style, tinting) => (
    <AnimatedBox
      key={tinting}
      style={style}
      gridArea={`stackedBoxes-${tinting}`}
      align="center"
    >
      <PiledBoxes tinting={tinting} />
    </AnimatedBox>
  ));
});

PileBoxes.displayName = "GridBoxes";

export const PileTextLabels = memo(() => {
  const tinting = usePart3Store((state) => state.tinting);

  const transition = useTransition([...tinting], {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const getTintingText = (tinting: Tinting) => {
    switch (tinting) {
      case "wedding":
        return "Wedding";
      case "family":
        return "Family & Friends";
      case "party":
        return "Party";
    }
  };
  const getTintingColor = (tinting: Tinting) => {
    switch (tinting) {
      case "wedding":
        return colorTheme.redLight;
      case "family":
        return colorTheme.greenLight;
      case "party":
        return colorTheme.blueLight;
    }
  };

  return transition((style, tinting) => (
    <AnimatedBox
      key={tinting}
      style={style}
      gridArea={`text-${tinting}`}
      align="center"
      justify="center"
    >
      <StyledText
        size="48px"
        style={{ lineHeight: "48px" }}
        color={getTintingColor(tinting)}
        textAlign="center"
      >
        {getTintingText(tinting)}
      </StyledText>
    </AnimatedBox>
  ));
});

PileTextLabels.displayName = "PileTextLabels";

const AnimatedBox = animated(Box);

const StyledText = styled(Text)`
  font-smooth: always !important;
  -webkit-font-smoothing: subpixel-antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility;
  user-select: none;
  backface-visibility: hidden;
`;
