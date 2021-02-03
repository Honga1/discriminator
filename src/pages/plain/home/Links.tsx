import { Box, Heading, ResponsiveContext } from "grommet";
import React, { CSSProperties, PropsWithChildren, useContext } from "react";
import { colorTheme } from "../../../components/colorTheme";
import { RoutedButton } from "../../../components/RoutedAnchor";

export function LinksSmall() {
  return (
    <Box className="links" gap="24px">
      <RoutedButton
        href="/about"
        plain
        fill
        label={
          <LinkFrame
            textColor={colorTheme.white}
            frameColor={colorTheme.blue}
            heading="About"
          >
            <Box height={"32px"}></Box>
          </LinkFrame>
        }
      />
      <RoutedButton
        href="/privacy"
        plain
        fill
        label={
          <LinkFrame
            textColor={colorTheme.white}
            frameColor={colorTheme.red}
            heading="Privacy"
          >
            <Box height={"32px"}></Box>
          </LinkFrame>
        }
      />
      <RoutedButton
        href="/credits"
        plain
        fill
        label={
          <LinkFrame
            textColor={colorTheme.white}
            frameColor={colorTheme.green}
            heading="Credits"
          >
            <Box height={"32px"}></Box>
          </LinkFrame>
        }
      />
    </Box>
  );
}

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

export const LinksFloating = ({
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
          <RoutedButton
            href="/about"
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
          <RoutedButton
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
          <RoutedButton
            href="/credits"
            plain
            fill
            label={
              <LinkFrame
                textColor={colorTheme.white}
                frameColor={colorTheme.green}
                heading="Credits"
              >
                <Box height={"64px"} width={"140px"}></Box>
              </LinkFrame>
            }
          />
        </div>
      </div>
    </Box>
  );
};

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
    <Box
      className="link frame"
      style={{
        outlineOffset: `-3px`,
        outline: `3px ${frameColor} solid`,
      }}
    >
      <LinksHeading
        textColor={textColor}
        frameColor={frameColor}
        heading={heading}
      />
      {children}
    </Box>
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
