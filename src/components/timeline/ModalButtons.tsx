import { Text } from "grommet";
import React from "react";
import styled from "styled-components";
import { colorTheme } from "../../theme";
import { OpenModalButton } from "../ModalButton";
import { FadeOutBox } from "./FadeOutBox";

export function ModalButtons(props: { isOpen: boolean; isSmall: boolean }) {
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
      <OpenModalButton
        plain
        modal="about"
        label={
          <StyledModalButtonText size="small">About</StyledModalButtonText>
        }
      />
      <OpenModalButton
        plain
        modal="privacy"
        label={
          <StyledModalButtonText size="small">Privacy</StyledModalButtonText>
        }
      />
      <OpenModalButton
        plain
        modal="credits"
        label={
          <StyledModalButtonText size="small">Credits</StyledModalButtonText>
        }
      />
    </FadeOutBox>
  );
}
const StyledModalButtonText = styled(Text)`
  color: ${colorTheme.offWhite};
  transition: text-decoration 0.2s;
  text-decoration: underline solid transparent;

  &:hover {
    text-decoration: underline solid ${colorTheme.offWhite};
  }
`;
