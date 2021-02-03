import { Box, Heading, Text } from "grommet";
import React, { PropsWithChildren } from "react";
import { colorTheme } from "../../../components/colorTheme";
import { LinksSmall } from "./Links";

export const HomeSmall = () => {
  return (
    <Box className="home small" margin="32px" gap={"48px"}>
      <ContentFrame
        textColor={colorTheme.yellow}
        frameColor={colorTheme.black}
        heading="Discriminator"
        level="primary"
      >
        <Box
          className="content"
          margin={{ horizontal: "32px", top: "56px", bottom: "64px" }}
          gap={"40px"}
        >
          <Text size="small">
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
              <Text size="small" color="blue">
                Start
              </Text>
            </Box>
          </Box>
        </Box>
      </ContentFrame>
      <LinksSmall />
    </Box>
  );
};

export const ContentFrame = ({
  children,
  frameColor,
  textColor,
  heading,
  level,
}: PropsWithChildren<{
  frameColor: string;
  textColor: string;
  heading: string;
  level: "primary";
}>) => {
  const isPrimary = level === "primary";
  const outlineWidth = isPrimary ? 4 : 3;
  return (
    <Box
      className="frame small"
      style={{
        outlineOffset: `-${outlineWidth}px`,
        outline: `${outlineWidth}px ${frameColor} solid`,
      }}
    >
      <HeadingBlock
        textColor={textColor}
        frameColor={frameColor}
        level={level}
        heading={heading}
      />
      {children}
    </Box>
  );
};

const HeadingBlock = ({
  frameColor,
  textColor,
  heading,
  level,
}: {
  frameColor: string;
  textColor: string;
  heading: string;
  level: "primary" | "secondary";
}) => {
  const isPrimary = level === "primary";
  const headingLevel = isPrimary ? 1 : 2;
  const padHorizontal = isPrimary ? "20px" : "16px";
  const padVertical = isPrimary ? "12px" : "8px";
  return (
    <Box className="heading-block" direction="row">
      <Box
        background={frameColor}
        pad={{ horizontal: padHorizontal, vertical: padVertical }}
      >
        <Heading level={headingLevel} color={textColor} margin="0" size="small">
          {heading}
        </Heading>
      </Box>
    </Box>
  );
};
