import { Grid, ResponsiveContext } from "grommet";
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useIsActive } from "../../hooks/useIsActive";
import { usePageType } from "../../hooks/usePageType";
import { ChapterSelectDropdown } from "./ChapterSelectDropdown";
import { FadeOutBox } from "./FadeOutBox";
import { ModalButtons } from "./ModalButtons";
import { MuteButton } from "./MuteButton";
import { NextChapterButton } from "./NextChapterButton";
import { PlayPauseButton } from "./PlayPauseButton";
import { RewindButton } from "./RewindButton";
import { ShowMenuButton } from "./ShowMenuButton";

export const ControlButtonRow = ({
  onOpenChange,
}: {
  onOpenChange: (isOpen: boolean) => void;
}) => {
  const isCover = usePageType() === "cover";
  const size = useContext(ResponsiveContext);
  const isSmall = size === "small";

  const [isOpen, setIsOpen] = useState(true);
  const isActive = useIsActive();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (isOpen && !isActive) {
      setIsOpen(false);
    }
  }, [isActive, isOpen]);

  return (
    <Grid
      fill="horizontal"
      rows={isSmall ? "3" : "1"}
      columns={isSmall ? ["flex"] : ["25%", "auto", "25%"]}
      pad={{ horizontal: "16px", top: "0px" }}
      gap="20px"
    >
      <FadeOutBox
        isShown={isOpen}
        flex={false}
        justify={isSmall ? "between" : "start"}
        direction="row"
        align="center"
        gap="20px"
        style={{ pointerEvents: !isOpen ? "none" : "auto" }}
      >
        <PlayPauseButton disabled={isCover} />
        <MuteButton />
        <RewindButton disabled={isCover} />
        <NextChapterButton />
        <ChapterSelectDropdown />
      </FadeOutBox>

      {isSmall && <ModalButtons isSmall={isSmall} isOpen={isOpen} />}
      <ShowMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
      {!isSmall && <ModalButtons isSmall={isSmall} isOpen={isOpen} />}
    </Grid>
  );
};
