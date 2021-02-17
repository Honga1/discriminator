import { Box, Grid, Heading, ResponsiveContext, Text } from "grommet";
import React, { PropsWithChildren, useContext } from "react";
import { CameraIndicator } from "../../components/CameraIndicator";
import { FullWidthStack } from "../../components/FullWidthStack";
import { Timeline } from "../../components/Timeline";
import { colorTheme } from "../../theme";
import { Cover1 } from "./Cover1";

export const Cover = () => {
  return (
    <Box fill background="black">
      <CoverContainer>
        <CoverContent />
      </CoverContainer>
    </Box>
  );
};

const CoverContainer = ({ children }: PropsWithChildren<{}>) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  if (size === "small" || size === "medium") {
    return <CoverContainerSmallMedium>{children}</CoverContainerSmallMedium>;
  } else {
    return <CoverContainerLargeXLarge>{children}</CoverContainerLargeXLarge>;
  }
};

const CoverContainerSmallMedium = ({ children }: PropsWithChildren<{}>) => {
  return (
    <>
      <CameraIndicator showBorder={false} backgroundColor="black" />
      <Box className="cover container" margin="16px">
        <Grid
          responsive={false}
          areas={[
            { name: "cover", start: [0, 0], end: [0, 0] },
            {
              name: "timeline",
              start: [0, 1],
              end: [0, 1],
            },
          ]}
          fill
          columns={["full"]}
          rows={["flex", "auto"]}
          gap="15px"
        >
          <Box gridArea="cover">
            <CoverFrame
              textColor={colorTheme.black}
              frameColor={colorTheme.yellow}
              heading="Discriminator"
            >
              {children}
            </CoverFrame>
          </Box>
          <Timeline gridArea="timeline" showScrubber={false} />
        </Grid>
      </Box>
    </>
  );
};

const CoverContainerLargeXLarge = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box className="cover container" margin="16px">
      <CoverFrame
        textColor={colorTheme.black}
        frameColor={colorTheme.yellow}
        heading="Discriminator"
      >
        <Grid
          responsive={false}
          areas={[
            { name: "cover", start: [0, 0], end: [0, 0] },
            {
              name: "timeline",
              start: [0, 1],
              end: [0, 1],
            },
          ]}
          fill
          columns={["full"]}
          rows={["flex", "auto"]}
        >
          <Box gridArea="cover">{children}</Box>
          <Timeline gridArea="timeline" showScrubber={false} />
        </Grid>
      </CoverFrame>
    </Box>
  );
};

const CoverContent = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const isSmall = size === "small";
  const marginTop = isSmall ? "4px" : "4px";
  const marginHorizontal = isSmall ? "4px" : "4px";
  const marginBottom = size === "large" || size === "xlarge" ? "0" : "4px";

  return (
    <Box
      gap={"40px"}
      margin={{
        horizontal: marginHorizontal,
        top: marginTop,
        bottom: marginBottom,
      }}
      className="cover content"
    >
      <Cover1 />
    </Box>
  );
};

const CoverFrame = ({
  children,
  frameColor,
  textColor,
  heading,
}: PropsWithChildren<{
  frameColor: string;
  textColor: string;
  heading: string;
}>) => {
  const style = {
    outlineOffset: `-4px`,
    outline: `4px ${frameColor} solid`,
  };

  const size = useContext(ResponsiveContext) as "small" | string;
  const isSmall = size === "small";
  return (
    <Box className="cover-frame" style={style}>
      <FullWidthStack fill anchor="top-fill">
        <Box fill>{children}</Box>
        <CoverHeadingBlock frameColor={frameColor}>
          <Heading
            level={2}
            color={textColor}
            margin="0"
            size={isSmall ? "small" : "medium"}
          >
            {heading}
          </Heading>
        </CoverHeadingBlock>
      </FullWidthStack>
    </Box>
  );
};

const CoverHeadingBlock = ({
  frameColor,
  children,
}: PropsWithChildren<{
  frameColor: string;
}>) => {
  const size = useContext(ResponsiveContext) as "small" | string;
  const isSmall = size === "small";
  const isSmallOrMedium = isSmall || size === "medium";

  return (
    <Box
      className="heading-block"
      direction="row"
      flex={false}
      justify="between"
      align="start"
    >
      <Box
        background={frameColor}
        pad={{ horizontal: "20px", vertical: "12px" }}
      >
        {children}
      </Box>
      {!isSmallOrMedium && (
        <Box justify="end">
          <CoverCameraIndicator />
        </Box>
      )}
    </Box>
  );
};

const CoverCameraIndicator = () => {
  return (
    <Box fill="horizontal" background={"black"} flex={false}>
      <Box direction="row" justify="end">
        <Box direction="row" border={{ color: "yellow", size: "3px" }}>
          <Box
            background="redLight"
            pad={{ horizontal: "17px", vertical: "7px" }}
          >
            <Text size="small" color="grayLight">
              Camera
            </Text>
          </Box>
          <Box
            background="charcoal"
            pad={{ horizontal: "17px", vertical: "7px" }}
          >
            <Text size="small" color="grayLight">
              off
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};