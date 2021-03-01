import { Box, Heading, ResponsiveContext } from "grommet";
import React, { CSSProperties, PropsWithChildren, useContext } from "react";
import styled from "styled-components";
import { colorTheme } from "../../theme";
import { QueryButton } from "./../../components/RoutedAnchor";

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

export function LinksSmall({ isOnDark = false }: { isOnDark?: boolean }) {
  const blue = !isOnDark ? colorTheme.blue : colorTheme.blueLight;
  const red = !isOnDark ? colorTheme.red : colorTheme.redLight;
  const green = !isOnDark ? colorTheme.green : colorTheme.greenLight;
  const text = !isOnDark ? colorTheme.white : colorTheme.black;
  return (
    <Box className="links" gap="24px">
      <QueryButton
        query={{ key: "modal", value: "about", operation: "open" }}
        plain
        label={
          <LinkFrame textColor={text} frameColor={blue} heading="About">
            <Box height={"32px"}></Box>
          </LinkFrame>
        }
      />
      <QueryButton
        query={{ key: "modal", value: "privacy", operation: "open" }}
        plain
        label={
          <LinkFrame textColor={text} frameColor={red} heading="Privacy">
            <Box height={"32px"}></Box>
          </LinkFrame>
        }
      />
      <QueryButton
        query={{ key: "modal", value: "credits", operation: "open" }}
        plain
        label={
          <LinkFrame textColor={text} frameColor={green} heading="Credits">
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
          <QueryButton
            query={{ key: "modal", value: "about", operation: "open" }}
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
          <QueryButton
            query={{ key: "modal", value: "privacy", operation: "open" }}
            href="/privacy"
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
          <QueryButton
            query={{ key: "modal", value: "credits", operation: "open" }}
            href="/credits"
            plain
            fill
            label={
              <LinkFrame
                textColor={colorTheme.white}
                frameColor={colorTheme.green}
                heading="Credits"
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

  transition: all 0.2s;
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
