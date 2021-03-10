import { Box, Grid, ResponsiveContext, Text } from "grommet";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import {
  CameraIndicatorBox,
  ChapterCameraIndicator,
} from "../../components/CameraIndicator";
import { FullWidthStack } from "../../components/FullWidthStack";
import { FinishedPlayingToNextButton } from "../../components/FinishedPlayingToNextButton";
import { Timeline } from "../../components/timeline/Timeline";
import { colorTheme } from "../../theme";

export const Media = ({ children }: PropsWithChildren<{}>) => {
  return (
    <MediaContainer>
      <MediaContent>{children}</MediaContent>
    </MediaContainer>
  );
};

const MediaContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box
      className="media container"
      pad="16px"
      fill="vertical"
      background="black"
      height={{ min: "396px" }}
    >
      <Grid
        responsive={false}
        areas={[
          { name: "media", start: [0, 0], end: [0, 0] },
          {
            name: "timeline",
            start: [0, 1],
            end: [0, 1],
          },
        ]}
        fill
        columns={["full"]}
        rows={["flex", "auto"]}
        gap="16px"
      >
        <Box gridArea="media" style={{ position: "relative" }}>
          <MediaFrame
            textColor={colorTheme.black}
            frameColor={"yellow"}
            heading="Discriminator"
          >
            {children}
          </MediaFrame>
          <Box style={{ position: "absolute", bottom: "10%", right: 0 }}>
            <FinishedPlayingToNextButton />
          </Box>
        </Box>
        <Timeline gridArea="timeline" />
      </Grid>
    </Box>
  );
};
const MediaContent = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box className="media content" align="center" height="100%">
      {children}
    </Box>
  );
};
const FadeOutBox = styled(Box)<{ isShown: boolean }>`
  opacity: ${(props) => (props.isShown ? "1" : "0")};
  transition: opacity 0.6s;
`;
const WebcamNotification = () => {
  const [isShown, setIsShown] = useState(true);
  useEffect(() => {
    const timeout =
      isShown &&
      setTimeout(() => {
        setIsShown(false);
      }, 3000);
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [isShown]);

  return (
    <FadeOutBox
      isShown={isShown}
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
    </FadeOutBox>
  );
};
const FrameBox = styled(Box)<{
  frameColor: keyof typeof colorTheme;
}>`
  & {
    position: relative;
    height: 100%;
  }
  &:after {
    outline-offset: -3px;
    outline: 3px ${(props) => colorTheme[props.frameColor]} solid;
    content: "";
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;
const MediaFrame = ({
  children,
  frameColor,
  textColor,
  heading,
}: PropsWithChildren<{
  frameColor: keyof typeof colorTheme;
  textColor: string;
  heading: string;
}>) => {
  const size = useContext(ResponsiveContext) as "small" | string;
  const isSmall = size === "small";
  const isSmallOrMedium = isSmall || size === "medium";
  return (
    <FrameBox className="media-frame" frameColor={frameColor}>
      <FullWidthStack fill anchor="top-fill">
        <Box fill>{children}</Box>
        <MediaHeadingBlock frameColor={frameColor}>
          {isSmallOrMedium && <WebcamNotification />}

          <Text
            size={"24px"}
            color={textColor}
            style={{ lineHeight: "100%", userSelect: "none" }}
          >
            {heading}
          </Text>
        </MediaHeadingBlock>
      </FullWidthStack>
    </FrameBox>
  );
};
const MediaHeadingBlock = ({
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
      style={{ userSelect: "none", pointerEvents: "none" }}
    >
      <Box
        background={frameColor}
        pad={{ horizontal: "16px", vertical: "12px" }}
      >
        {children}
      </Box>
      <Box justify="end">
        {isSmallOrMedium && <CameraIndicatorBox />}
        {!isSmallOrMedium && <ChapterCameraIndicator />}
      </Box>
    </Box>
  );
};
