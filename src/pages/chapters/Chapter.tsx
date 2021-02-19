import { Box, Grid, Heading, ResponsiveContext, Text } from "grommet";
import React, { PropsWithChildren, useContext } from "react";
import styled from "styled-components";
import {
  CameraIndicator,
  ChapterCameraIndicator,
} from "../../components/CameraIndicator";
import { FullWidthStack } from "../../components/FullWidthStack";
import { Timeline } from "../../components/Timeline";
import { colorTheme } from "../../theme";
import { LinksSmall } from "../plain/Links";
import { ChapterX } from "./ChapterX";
import { useIsActive } from "./useIsActive";

export const Chapter = () => {
  return (
    <Box fill background="black" overflow="hidden">
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

const AspectRatioBox = styled(Box)`
  & {
  }
  &::before {
    content: "";
    float: left;
    height: 0;
    padding-top: calc(10 / 14 * 100%);
  }
  &::after {
    /* to clear float */
    content: "";
    display: table;
    clear: both;
  }
`;

const ChapterContainerSmallMedium = ({ children }: PropsWithChildren<{}>) => {
  const isSmall = useContext(ResponsiveContext) === "small";
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
              <AspectRatioBox
                responsive={false}
                flex={false}
                height={{
                  min: 360 + "px",
                }}
              >
                <Box
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                  justify="center"
                >
                  {children}
                </Box>
              </AspectRatioBox>
            </ChapterFrame>
          </Box>
          <Timeline gridArea="timeline" />
        </Grid>
      </Box>
      <Box margin="16px">{isSmall && <LinksSmall />}</Box>
    </>
  );
};

const ChapterContainerLargeXLarge = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box className="cover container" margin="16px">
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

const WebcamNotification = () => {
  return (
    <Box
      flex={false}
      style={{
        position: "absolute",
        minHeight: "100%",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
      }}
      background={"black"}
      pad="10px"
      border={{ color: "red", size: "3px" }}
    >
      <Text size="xsmall" color="offWhite">
        To make this sequence interactive, turn on your webcam
      </Text>
    </Box>
  );
};

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
          <Box fill>{children}</Box>
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
      <Box>
        {isSmallOrMedium && <WebcamNotification />}

        <OpacityFade
          pad={{ horizontal: "20px", vertical: "12px" }}
          background={frameColor}
          isShown={isActive}
        >
          {children}
        </OpacityFade>
      </Box>
      {!isSmallOrMedium && (
        <Box justify="end">
          <ChapterCameraIndicator />
        </Box>
      )}
    </Box>
  );
};
