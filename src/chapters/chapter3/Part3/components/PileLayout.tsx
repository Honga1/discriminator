import { Box, ResponsiveContext, Text } from "grommet";
import React, { memo, useContext } from "react";
import { animated, useTransition } from "react-spring";
import { colorTheme } from "src/theme";
import styled from "styled-components";
import {
  Tinting,
  tintingInShownOrder,
  usePart3Store,
} from "../store/Part3Store";
import { PiledBoxes } from "./PiledBoxes";

export const smallGridAreas = [
  { name: "stackedBoxes-wedding", start: [0, 0], end: [0, 0] },
  { name: "text-wedding", start: [0, 1], end: [0, 1] },
  { name: "stackedBoxes-party", start: [0, 2], end: [0, 2] },
  { name: "text-party", start: [0, 3], end: [0, 3] },
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
export const smallGridRows = ["2fr", "1fr", "3fr", "1fr", "3fr", "1fr"];
export const smallGridColumns = ["flex"];
export const largeGridColumns = ["flex", "flex", "flex"];
export const largeGridRows = ["1fr", "3fr", "1fr"];

export const PileBoxes = memo(() => {
  return (
    <>
      {tintingInShownOrder.map((tint) => (
        <Box key={tint} gridArea={`stackedBoxes-${tint}`} align="center">
          <PiledBoxes tinting={tint} />
        </Box>
      ))}
    </>
  );
});

PileBoxes.displayName = "GridBoxes";

export const PileTextLabels = memo(() => {
  const tinting = usePart3Store((state) => state.tinting);
  const isSmall = useContext(ResponsiveContext) === "small";

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
        size={isSmall ? "24px" : "48px"}
        style={{ lineHeight: isSmall ? "32px" : "48px" }}
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
  -webkit-backface-visibility: hidden;
`;
