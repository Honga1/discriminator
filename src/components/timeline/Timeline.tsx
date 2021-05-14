import { Box } from "grommet";
import React, { useState } from "react";
import { ChapterIndicators } from "./ChapterIndicators";
import { ControlButtonRow } from "./ControlButtonRow";
import { FadeOutBox } from "./FadeOutBox";

export const Timeline = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Box
      gap="8px"
      pad="16px"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: isOpen
          ? "linear-gradient(0deg, rgba(32, 33, 34, 0.5), rgba(32, 33, 34, 0.5))"
          : "none",
        zIndex: 10,
      }}
    >
      <FadeOutBox
        isShown={isOpen}
        style={{ pointerEvents: !isOpen ? "none" : "auto" }}
      >
        <ChapterIndicators />
      </FadeOutBox>
      <ControlButtonRow onOpenChange={setIsOpen} />
    </Box>
  );
};
