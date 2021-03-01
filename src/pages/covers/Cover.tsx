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
import { Timeline } from "../../components/Timeline";
import { colorTheme } from "../../theme";
import { Cover1 } from "./Cover1";

export const Cover = () => {
  return (
    <Box fill background="grey">
      <CoverContainer>
        <CoverContent />
      </CoverContainer>
    </Box>
  );
};

const CoverContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
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
        gap="16px"
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
  );
};

const CoverContent = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const isSmall = size === "small";
  const marginTop = isSmall ? "3px" : "3px";
  const marginHorizontal = isSmall ? "3px" : "3px";
  const marginBottom = size === "large" || size === "xlarge" ? "0" : "3px";

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
    outlineOffset: `-3px`,
    outline: `3px ${frameColor} solid`,
  };

  const size = useContext(ResponsiveContext) as "small" | string;
  const isSmall = size === "small";
  const isSmallOrMedium = isSmall || size === "medium";
  return (
    <Box className="cover-frame" style={style}>
      <FullWidthStack fill anchor="top-fill">
        <Box fill>{children}</Box>
        <CoverHeadingBlock frameColor={frameColor}>
          {isSmallOrMedium && <WebcamNotification />}

          <Text size={"24px"} color={textColor} style={{ lineHeight: "100%" }}>
            {heading}
          </Text>
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
