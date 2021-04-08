import { Box } from "grommet";
import React from "react";
import styled from "styled-components";
import { useIsActive } from "../../hooks/useIsActive";
import { ChapterIndicators } from "./ChapterIndicators";
import { ControlButtonRow } from "./ControlButtonRow";

const FadeOutBox = styled(Box)<{ isShown: boolean }>`
  opacity: ${(props) => (props.isShown ? "1" : "0")};
  transition: opacity 0.6s;
`;

export const Timeline = () => {
  const isActive = useIsActive();
  return (
    <FadeOutBox
      isShown={isActive}
      gap="8px"
      pad="16px"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background:
          "linear-gradient(0deg, rgba(32, 33, 34, 0.5), rgba(32, 33, 34, 0.5))",
      }}
    >
      <ChapterIndicators />
      <ControlButtonRow />
    </FadeOutBox>
  );
};
