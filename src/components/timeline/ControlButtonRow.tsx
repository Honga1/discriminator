import {
  Box,
  Button,
  ButtonType,
  Grid,
  ResponsiveContext,
  Text,
  Timeout,
} from "grommet";
import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useIsActive } from "../../hooks/useIsActive";
import { usePageType } from "../../hooks/usePageType";
import { colorTheme } from "../../theme";
import { ModalButton } from "../ModalButton";
import { ChapterSelectDropdown } from "./ChapterSelectDropdown";
import { NextChapterButton } from "./NextChapterButton";
import { PlayPauseButton } from "./PlayPauseButton";
import { RewindButton } from "./RewindButton";

export const ControlButtonRow = ({
  onOpenChange,
}: {
  onOpenChange: (isOpen: boolean) => void;
}) => {
  const isCover = usePageType() === "cover";
  const size = useContext(ResponsiveContext);
  const isSmall = size === "small";

  const [isOpen, setIsOpen] = useState(true);
  const [hasTimeoutElapsed, setHasTimeoutElapsed] = useState(true);
  const isActive = useIsActive();

  useEffect(() => {
    onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (isOpen && hasTimeoutElapsed && !isActive) {
      setIsOpen(false);
    }
  }, [hasTimeoutElapsed, isActive, isOpen]);

  const timeout = useRef<Timeout>();

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
        <RewindButton disabled={isCover} />
        <NextChapterButton />
        <ChapterSelectDropdown />
      </FadeOutBox>

      {isSmall ? (
        <>
          <ModalButtons isSmall={isSmall} isOpen={isOpen}></ModalButtons>{" "}
          <ShowMenuButton
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setHasTimeoutElapsed={setHasTimeoutElapsed}
            timeout={timeout}
          ></ShowMenuButton>
        </>
      ) : (
        <>
          <ShowMenuButton
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setHasTimeoutElapsed={setHasTimeoutElapsed}
            timeout={timeout}
          ></ShowMenuButton>
          <ModalButtons isSmall={isSmall} isOpen={isOpen}></ModalButtons>
        </>
      )}
    </Grid>
  );
};

function ModalButtons(props: { isOpen: boolean; isSmall: boolean }) {
  return (
    <FadeOutBox
      isShown={props.isOpen}
      flex={false}
      direction="row"
      gap="20px"
      justify={props.isSmall ? "between" : "end"}
      style={{ pointerEvents: !props.isOpen ? "none" : "auto" }}
      align="center"
      width="100%"
    >
      <ModalButton
        plain
        query={{
          key: "modal",
          value: "about",
          operation: "open",
        }}
        label={
          <Text size="small" color={colorTheme["blueLight"]}>
            About
          </Text>
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
          <Text size="small" color={colorTheme["redLight"]}>
            Privacy
          </Text>
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
          <Text size="small" color={colorTheme["greenLight"]}>
            Credits
          </Text>
        }
      />
    </FadeOutBox>
  );
}

function ShowMenuButton(props: {
  timeout: { current: number | undefined };
  setHasTimeoutElapsed: (arg0: boolean) => void;
  setIsOpen: (arg0: boolean) => void;
  isOpen: boolean;
}) {
  return (
    <Box align="center" justify="center">
      <ThreeDotsMenuButton
        isOpen={props.isOpen}
        onMouseOver={() => {
          if (props.timeout.current) clearTimeout(props.timeout.current);
          props.setHasTimeoutElapsed(false);
          props.timeout.current = (setTimeout(
            () => props.setHasTimeoutElapsed(true),
            4000
          ) as unknown) as Timeout;
          props.setIsOpen(true);
        }}
      />
    </Box>
  );
}

function ThreeDotsMenuButton({
  isOpen,
  ...buttonProps
}: ButtonType & { isOpen: boolean }) {
  return (
    <Button
      {...buttonProps}
      plain
      label={
        <Box
          width="64px"
          height="32px"
          direction="row"
          flex={false}
          justify="between"
          align="center"
        >
          <Box
            width="14px"
            height="14px"
            style={{ borderRadius: "50%", transition: "background 0.6s" }}
            border={{ color: colorTheme.offWhite, size: "2px" }}
            background={isOpen ? colorTheme.yellow : "none"}
          ></Box>
          <Box
            width="14px"
            height="14px"
            style={{ borderRadius: "50%", transition: "background 0.6s" }}
            border={{ color: colorTheme.offWhite, size: "2px" }}
            background={isOpen ? colorTheme.yellow : "none"}
          ></Box>
          <Box
            width="14px"
            height="14px"
            style={{ borderRadius: "50%", transition: "background 0.6s" }}
            border={{ color: colorTheme.offWhite, size: "2px" }}
            background={isOpen ? colorTheme.yellow : "none"}
          ></Box>
        </Box>
      }
    ></Button>
  );
}

const FadeOutBox = styled(Box)<{ isShown: boolean }>`
  opacity: ${(props) => (props.isShown ? "1" : "0")};
  transition: opacity 0.6s;
`;
