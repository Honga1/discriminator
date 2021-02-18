import { Box, Grid, Heading, ResponsiveContext, Text } from "grommet";
import React, { PropsWithChildren, useContext } from "react";
import styled from "styled-components";
import { CameraIndicator } from "../../components/CameraIndicator";
import { FullWidthStack } from "../../components/FullWidthStack";
import { Timeline } from "../../components/Timeline";
import { colorTheme } from "../../theme";
import { ChapterX } from "./ChapterX";
import { useIsActive } from "./useIsActive";

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
            <ChapterFrame textColor={colorTheme.black} heading="Discriminator">
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
    <Box className="cover container" margin="16px" fill="vertical">
      <ChapterFrame textColor={colorTheme.black} heading="Discriminator">
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
          <Box gridArea="cover" fill>
            {children}
          </Box>
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
  const marginTop = isSmall ? "4px" : "0px";
  const marginHorizontal = isSmall ? "4px" : "0px";
  const marginBottom = size === "large" || size === "xlarge" ? "0px" : "4px";

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
      <ChapterX />
    </Box>
  );
};

const FadingOutline = styled(Box)<{ outlineColor: string }>`
  outline-color: ${(props) => props.outlineColor};
  outline-offset: -4px;
  outline-style: solid;
  outline-width: 4px;

  transition: outline-color 0.4s;
`;

const ChapterFrameStack = styled.div`
  position: relative;
  height: 100%;
`;

const StackLayerGuiding = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const StackLayerNotGuiding = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
`;

const ChapterFrame = ({
  children,
  textColor,
  heading,
}: PropsWithChildren<{
  textColor: string;
  heading: string;
}>) => {
  const size = useContext(ResponsiveContext) as "small" | string;
  const isSmall = size === "small";

  const isActive = useIsActive();
  return (
    <ChapterFrameStack>
      <StackLayerGuiding>
        <FullWidthStack fill anchor="top-fill">
          <Box fill background={{ color: "red", opacity: 0.0 }}>
            {children}
          </Box>
          <ChapterHeadingBlock
            frameColor={colorTheme.yellow}
            isActive={isActive}
          >
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
      </StackLayerGuiding>
      <StackLayerNotGuiding>
        <FadingOutline
          fill
          outlineColor={isActive ? colorTheme.yellow : colorTheme.yellowOpaque}
          className="cover-frame"
        />
      </StackLayerNotGuiding>
    </ChapterFrameStack>
  );
};

const OpacityFade = styled(Box)<{ isShown: boolean }>`
  opacity: ${(props) => (props.isShown ? 1 : 0)};
  transition: all 0.4s;
`;

const ChapterHeadingBlock = ({
  frameColor,
  children,
  isActive,
}: PropsWithChildren<{
  isActive: boolean;
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
      <OpacityFade
        background={frameColor}
        isShown={isActive}
        pad={{ horizontal: "20px", vertical: "12px" }}
      >
        {children}
      </OpacityFade>
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
