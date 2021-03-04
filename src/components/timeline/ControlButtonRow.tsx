import { Box, ResponsiveContext } from "grommet";
import React, { useContext } from "react";
import { useIsActive } from "../../hooks/useIsActive";
import { usePageType } from "../../hooks/usePageType";
import { colorTheme } from "../../theme";
import { ModalButton } from "../ModalButton";
import { ChapterSelectDropdown } from "./ChapterSelectDropdown";
import { NextChapterButton } from "./NextChapterButton";
import { PlayPauseButton } from "./PlayPauseButton";
import { RewindButton } from "./RewindButton";
import { FadeColorText } from "./Timeline";

export const ControlButtonRow = () => {
  const isActive = useIsActive();
  const isSmall = useContext(ResponsiveContext) === "small";
  const isCover = usePageType() === "cover";
  return (
    <Box
      direction="row"
      justify="between"
      flex={false}
      pad={{ horizontal: "16px", top: "0px", bottom: "8px" }}
      align="center"
    >
      <Box direction="row" gap={"20px"} align="center">
        <PlayPauseButton disabled={isCover} />
        <RewindButton disabled={isCover} />
        <NextChapterButton />
        <ChapterSelectDropdown />
      </Box>
      {!isSmall && (
        <Box direction="row" gap={"20px"} alignSelf="center">
          <ModalButton
            plain
            query={{ key: "modal", value: "about", operation: "open" }}
            label={
              <FadeColorText
                size="small"
                textColor={
                  isActive ? colorTheme["blueLight"] : colorTheme.offWhite
                }
              >
                About
              </FadeColorText>
            }
          />
          <ModalButton
            plain
            query={{
              key: "modal",
              value: "privacy",
              operation: "open",
            }}
            label={
              <FadeColorText
                size="small"
                textColor={
                  isActive ? colorTheme["redLight"] : colorTheme.offWhite
                }
              >
                Privacy
              </FadeColorText>
            }
          />
          <ModalButton
            plain
            query={{
              key: "modal",
              value: "credits",
              operation: "open",
            }}
            label={
              <FadeColorText
                size="small"
                textColor={
                  isActive ? colorTheme["greenLight"] : colorTheme.offWhite
                }
              >
                Credits
              </FadeColorText>
            }
          />
        </Box>
      )}
    </Box>
  );
};
