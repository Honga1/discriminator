import { Box, Heading, Text } from "grommet";
import React, { PropsWithChildren } from "react";
import { colorTheme } from "../../../components/colorTheme";
import { LinksFloating } from "./Links";

export const HomeMedium = () => {
  return (
    <Box
      className="home medium"
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
      <LinksFloating position="below" />
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
        pad={{ horizontal: "20px", vertical: "12px" }}
      >
        <Heading level={1} color={textColor} margin="0" size="medium">
          {heading}
        </Heading>
      </Box>
    </Box>
  );
};
