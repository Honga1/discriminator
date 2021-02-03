import { Box, Heading, Stack, Text } from "grommet";
import React, { PropsWithChildren } from "react";
import { colorTheme } from "../../components/colorTheme";
import { RoutedButton } from "../../components/RoutedAnchor";
import { FrameSmall } from "./HomeSmall";

export const HomeMedium = () => {
  return (
    <Box
      className="home small"
      margin={{ horizontal: "64px", top: "96px", bottom: "64px" }}
      gap={"48px"}
    >
      <FrameMedium
        textColor={colorTheme.yellow}
        frameColor={colorTheme.black}
        heading="Discriminator"
      >
        <Box
          className="content"
          margin={{ horizontal: "64px", top: "48px", bottom: "64px" }}
          gap={"40px"}
        >
          <Text size="medium">
            Egestas enim cursus pretium leo, egestas blandit egestas nunc magna.
            Lectus euismod mauris faucibus massa nibh condimentum vitae nunc
            quis. Lacus vitae amet aliquam id leo. Interdum vulputate eu et
            aliquet elit morbi bibendum. Tellus euismod metus, id feugiat amet.
          </Text>

          <Box className="start-link" direction="row">
            <Box
              border={{ color: "blue", style: "solid", size: "3px" }}
              pad={{ horizontal: "27px", vertical: "7px" }}
            >
              <Text size="medium" color="blue">
                Start
              </Text>
            </Box>
          </Box>
        </Box>
      </FrameMedium>
      <Box className="links" direction="row" justify="end">
        <Stack>
          <Box width="442px" height={"196px"}></Box>
          <Box direction="row" pad={{ top: "60px" }}>
            <RoutedButton
              href="/about"
              plain
              fill
              label={
                <FrameSmall
                  level="secondary"
                  textColor={colorTheme.white}
                  frameColor={colorTheme.blue}
                  heading="About"
                >
                  <Box height={"64px"} width={"128px"}></Box>
                </FrameSmall>
              }
            />
          </Box>
          <Box fill direction="row" pad={{ left: "204px" }}>
            <RoutedButton
              href="/privacy"
              plain
              fill
              label={
                <FrameSmall
                  level="secondary"
                  textColor={colorTheme.white}
                  frameColor={colorTheme.red}
                  heading="Privacy"
                >
                  <Box height={"96px"} width={"142px"}></Box>
                </FrameSmall>
              }
            />
          </Box>
          <Box justify="end" fill>
            <Box direction="row" justify="end">
              <RoutedButton
                href="/credits"
                plain
                fill
                label={
                  <FrameSmall
                    level="secondary"
                    textColor={colorTheme.white}
                    frameColor={colorTheme.green}
                    heading="Credits"
                  >
                    <Box height={"64px"} width={"140px"}></Box>
                  </FrameSmall>
                }
              />
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export const FrameMedium = ({
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
      className="frame medium"
      style={{
        outlineOffset: `-${4}px`,
        outline: `${4}px ${frameColor} solid`,
      }}
    >
      <HeadingBlockMedium
        textColor={textColor}
        frameColor={frameColor}
        heading={heading}
      />
      {children}
    </Box>
  );
};

const HeadingBlockMedium = ({
  frameColor,
  textColor,
  heading,
}: {
  frameColor: string;
  textColor: string;
  heading: string;
}) => {
  return (
    <Box className="heading-block medium" direction="row">
      <Box
        background={frameColor}
        pad={{ horizontal: "20px", vertical: "16px" }}
      >
        <Heading level={1} color={textColor} margin="0" size="medium">
          {heading}
        </Heading>
      </Box>
    </Box>
  );
};
