import { Box, Heading, ResponsiveContext } from "grommet";
import React, { CSSProperties, PropsWithChildren, useContext } from "react";
import styled from "styled-components";
import { colorTheme } from "../theme";
import { OpenModalButton } from "../components/ModalButton";

export const Links = () => {
  const size = useContext(ResponsiveContext);

  switch (size) {
    case "small":
      return <LinksSmall />;
    case "medium":
      return <LinksFloating position="below" />;
    default:
      return <LinksFloating position="bottom-right" />;
  }
};

function LinksSmall({ isOnDark = false }: { isOnDark?: boolean }) {
  const blue = !isOnDark ? colorTheme.blue : colorTheme.blueLight;
  const red = !isOnDark ? colorTheme.red : colorTheme.redLight;
  const green = !isOnDark ? colorTheme.green : colorTheme.greenLight;
  const text = !isOnDark ? colorTheme.white : colorTheme.black;
  return (
    <Box className="links" gap="24px">
      <OpenModalButton
        modal="about"
        plain
        label={
          <LinkFrame textColor={text} frameColor={blue} heading="About">
            <Box height={"32px"}></Box>
          </LinkFrame>
        }
      />
      <OpenModalButton
        modal="privacy"
        plain
        label={
          <LinkFrame textColor={text} frameColor={red} heading="Privacy">
            <Box height={"32px"}></Box>
          </LinkFrame>
        }
      />
      <OpenModalButton
        modal="support"
        plain
        label={
          <LinkFrame textColor={text} frameColor={green} heading="Support">
            <Box height={"32px"}></Box>
          </LinkFrame>
        }
      />
    </Box>
  );
}

const LinksFloating = ({
  position,
}: {
  position: "below" | "bottom-right";
}) => {
  const style: CSSProperties =
    position === "below"
      ? { position: "relative", left: "-454px", top: "0px" }
      : { position: "relative", left: "-282px", top: "-100px" };
  return (
    <Box className="links" direction="row" justify="end" style={style}>
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: "64px",
          }}
        >
          <OpenModalButton
            modal="about"
            plain
            fill
            label={
              <LinkFrame
                textColor={colorTheme.white}
                frameColor={colorTheme.blue}
                heading="About"
              >
                <Box height={"64px"} width={"128px"}></Box>
              </LinkFrame>
            }
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: "204px",
          }}
        >
          <OpenModalButton
            modal="privacy"
            plain
            fill
            label={
              <LinkFrame
                textColor={colorTheme.white}
                frameColor={colorTheme.red}
                heading="Privacy"
              >
                <Box height={"96px"} width={"142px"}></Box>
              </LinkFrame>
            }
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: "314px",
            top: "84px",
          }}
        >
          <OpenModalButton
            modal="support"
            plain
            fill
            label={
              <LinkFrame
                textColor={colorTheme.white}
                frameColor={colorTheme.green}
                heading="Support"
              >
                <Box height={"60px"} width={"140px"}></Box>
              </LinkFrame>
            }
          />
        </div>
      </div>
    </Box>
  );
};

const OnHoverBox = styled(Box)`
  &:hover {
    transform: translateY(-4px);
  }

  transition: transform 0.2s;
`;

const LinkFrame = ({
  children,
  frameColor,
  textColor,
  heading,
}: PropsWithChildren<{
  frameColor: string;
  textColor: string;
  heading: string;
}>) => {
  return (
    <OnHoverBox
      className="link frame"
      style={{
        outlineOffset: `-3px`,
        outline: `3px ${frameColor} solid`,
      }}
      margin={{ bottom: "8px" }}
    >
      <LinksHeading
        textColor={textColor}
        frameColor={frameColor}
        heading={heading}
      />
      {children}
    </OnHoverBox>
  );
};

const LinksHeading = ({
  frameColor,
  textColor,
  heading,
}: {
  frameColor: string;
  textColor: string;
  heading: string;
}) => {
  return (
    <Box className="link heading" direction="row">
      <Box
        background={frameColor}
        pad={{ horizontal: "16px", vertical: "8px" }}
      >
        <Heading level={2} color={textColor} margin="0" size="small">
          {heading}
        </Heading>
      </Box>
    </Box>
  );
};
