import { Grid, ResponsiveContext, Text, Box } from "grommet";
import React, { useContext } from "react";
import styled from "styled-components";
import { colorTheme } from "../../theme";
import { OpenModalButton } from "../ModalButton";
import { FadeOutBox } from "./FadeOutBox";

export function ModalButtons(props: { isOpen: boolean; isSmall: boolean }) {
  const isSmall = useContext(ResponsiveContext) === "small";

  if (isSmall) {
    return <ModalButtonsSmall isOpen={props.isOpen}></ModalButtonsSmall>;
  } else {
    return <ModalButtonsLarge isOpen={props.isOpen}></ModalButtonsLarge>;
  }
}

function ModalButtonsLarge(props: { isOpen: boolean }) {
  return (
    <FadeOutBox
      isShown={props.isOpen}
      flex={false}
      direction="row"
      gap="20px"
      justify={"end"}
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
        modal="support"
        label={
          <StyledModalButtonText size="small">Support</StyledModalButtonText>
        }
      />
    </FadeOutBox>
  );
}

function ModalButtonsSmall(props: { isOpen: boolean }) {
  return (
    <FadeOutBox
      isShown={props.isOpen}
      flex={false}
      direction="row"
      gap="20px"
      style={{ pointerEvents: !props.isOpen ? "none" : "auto" }}
      align="center"
      width="100%"
    >
      <Grid
        fill
        columns={["1fr", "1fr", "1fr"]}
        rows={["auto"]}
        justifyContent="center"
      >
        <OpenModalButton
          plain
          modal="about"
          label={
            <Box fill align="start">
              <StyledModalButtonText size="small">About</StyledModalButtonText>
            </Box>
          }
        />

        <OpenModalButton
          plain
          modal="privacy"
          label={
            <Box fill align="center">
              <StyledModalButtonText size="small">
                Privacy
              </StyledModalButtonText>
            </Box>
          }
        />
        <OpenModalButton
          plain
          modal="support"
          label={
            <Box fill align="end">
              <StyledModalButtonText size="small">
                Support
              </StyledModalButtonText>
            </Box>
          }
        />
      </Grid>
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
