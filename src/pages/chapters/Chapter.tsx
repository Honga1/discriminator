import { Box, Grid, Heading, ResponsiveContext, Text } from "grommet";
import React, { PropsWithChildren, useContext } from "react";
import { colorTheme } from "../../theme";
import { FullWidthStack } from "../../components/FullWidthStack";
import { QueryButton } from "../../components/RoutedAnchor";
import { Chapter1 } from "./Chapter1";
import { CameraIndicator } from "../../components/CameraIndicator";
import { Timeline } from "../../components/Timeline";

export const Chapter = () => {
  return (
    <Box fill background="black">
      <ChapterContainer>
        <ChapterContent />
      </ChapterContainer>
    </Box>
  );
};

const ChapterContainer = ({ children }: PropsWithChildren<{}>) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  if (size === "small" || size === "medium") {
    return (
      <ChapterContainerSmallMedium>{children}</ChapterContainerSmallMedium>
    );
  } else {
    return (
      <ChapterContainerLargeXLarge>{children}</ChapterContainerLargeXLarge>
    );
  }
};

const ChapterContainerSmallMedium = ({ children }: PropsWithChildren<{}>) => {
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
            <ChapterFrame
              textColor={colorTheme.black}
              frameColor={colorTheme.yellow}
              heading="Discriminator"
            >
              {children}
            </ChapterFrame>
          </Box>
          <Timeline gridArea="timeline" />
        </Grid>
      </Box>
    </>
  );
};

const ChapterContainerLargeXLarge = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box className="cover container" margin="16px">
      <ChapterFrame
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
          gap="12px"
        >
          <Box gridArea="cover">{children}</Box>
          <Timeline gridArea="timeline" />
        </Grid>
      </ChapterFrame>
    </Box>
  );
};

const ChapterContent = () => {
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
      <Chapter1 onFinished={() => {}} />
    </Box>
  );
};

const ChapterFrame = ({
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
        <ChapterHeadingBlock frameColor={frameColor}>
          <Heading
            level={2}
            color={textColor}
            margin="0"
            size={isSmall ? "small" : "medium"}
          >
            {heading}
          </Heading>
        </ChapterHeadingBlock>
      </FullWidthStack>
    </Box>
  );
};

const ChapterHeadingBlock = ({
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
          <ChapterCameraIndicator />
        </Box>
      )}
    </Box>
  );
};

const ChapterCameraIndicator = () => {
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
