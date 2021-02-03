import { Box, Text } from "grommet";
import React from "react";
import { colorTheme } from "../../components/colorTheme";
import { RoutedButton } from "../../components/RoutedAnchor";
import { FrameMedium } from "./HomeMedium";
import { FrameSmall } from "./HomeSmall";

export const HomeLarge = () => {
  return (
    <Box
      className="home large"
      margin={{ left: "64px", top: "96px", bottom: "20px" }}
      width={{ max: "896px" }}
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
        <div style={{ position: "relative", left: "-282px", top: "-100px" }}>
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
          </div>
        </div>
      </Box>
    </Box>
  );
};
