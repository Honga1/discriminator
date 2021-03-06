import { Box } from "grommet";
import React, { useState } from "react";
import { store } from "src/store/store";
import { ChapterIndicators } from "./ChapterIndicators";
import { ControlButtonRow } from "./ControlButtonRow";
import { FadeOutBox } from "./FadeOutBox";

export const Timeline = () => {
  const [isOpen, setIsOpen] = useState(store.getState().firstLoad);

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
          ? "linear-gradient(0deg, rgba(32, 33, 34, 0.8), rgba(32, 33, 34, 0.8))"
          : "none",
        zIndex: 10,
        pointerEvents: !isOpen ? "none" : "auto",
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
