import { Box, Text } from "grommet";
import React from "react";
import styled from "styled-components";
import { useIsActive } from "../../hooks/useIsActive";
import { usePageType } from "../../hooks/usePageType";
import { colorTheme } from "../../theme";
import { ModalButton } from "../ModalButton";
import { ChapterSelectDropdown } from "./ChapterSelectDropdown";
import { NextChapterButton } from "./NextChapterButton";
import { PlayPauseButton } from "./PlayPauseButton";
import { RewindButton } from "./RewindButton";

const FadeColorText = styled(Text)<{ textColor: string }>`
  color: ${(props) => props.textColor};
  transition: color 0.4s;
`;

export const ControlButtonRow = () => {
  const isActive = useIsActive();
  const isCover = usePageType() === "cover";
  return (
    <>
      <Box
        direction="row"
        justify="between"
        flex={false}
        wrap
        pad={{ horizontal: "16px", top: "0px" }}
        align="center"
      >
        <Box flex={false} justify="start" direction="row" gap="20px">
          <PlayPauseButton disabled={isCover} />
          <RewindButton disabled={isCover} />
          <NextChapterButton />
          <ChapterSelectDropdown />
        </Box>
        <Box flex={false} direction="row" gap="20px">
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
      </Box>
    </>
  );
};
