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
import { LinksSmall } from "../plain/Links";
import { ChapterX } from "./ChapterX";
import { useIsActive } from "./useIsActive";

export const Chapter = () => {
  return (
    <ChapterContainer>
      <ChapterContent />
    </ChapterContainer>
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
      <Box background="black" overflow="vertical">
        <ChapterContainerSmallMedium>{children}</ChapterContainerSmallMedium>
      </Box>
    );
  } else {
    return (
      <Box fill background="black" overflow="hidden">
        <ChapterContainerLargeXLarge>{children}</ChapterContainerLargeXLarge>
      </Box>
    );
  }
};

const ChapterContainerSmallMedium = ({ children }: PropsWithChildren<{}>) => {
  const size = useContext(ResponsiveContext);
  const isSmall = size === "small";
  const isSmallOrMedium = isSmall || size === "medium";

  return (
    <>
      <Box flex={false} className="chapter container" margin="16px">
        <Grid
          responsive={false}
          areas={[
            { name: "chapter", start: [0, 0], end: [0, 0] },
            { name: "notification", start: [0, 1], end: [0, 1] },
            {
              name: "timeline",
              start: [0, 2],
              end: [0, 2],
            },
          ]}
          fill
          columns={["full"]}
          rows={["auto", "auto", "auto"]}
          gap="16px"
        >
          <Box
            gridArea="chapter"
            // height={{ min: (9 / 16) * window.innerWidth + "px" }}
          >
            <ChapterFrame textColor={colorTheme.black} heading="Discriminator">
              {children}
            </ChapterFrame>
          </Box>
          <Box gridArea="notification">
            {isSmallOrMedium && <WebcamNotification />}
          </Box>
          <Timeline gridArea="timeline" />
        </Grid>
      </Box>
      <Box margin="16px">{isSmall && <LinksSmall isOnDark={true} />}</Box>
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
  const marginTop = isSmall ? "0px" : "0px";
  const marginHorizontal = isSmall ? "0px" : "0px";
  const marginBottom = size === "large" || size === "xlarge" ? "0px" : "0px";

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
  outline-offset: -3px;
  outline-style: solid;
  outline-width: 3px;

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
      pad="10px"
      border={{ color: "red", size: "3px" }}
    >
      <Text size="xsmall" color="offWhite">
        To make this sequence interactive, turn on your webcam
      </Text>
    </FadeOutBox>
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
            <Text
              size={"24px"}
              color={textColor}
              style={{ lineHeight: "100%", userSelect: "none" }}
            >
              {heading}
            </Text>
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
        <OpacityFade
          pad={{ horizontal: "16px", vertical: "12px" }}
          background={frameColor}
          isShown={isActive}
        >
          {children}
        </OpacityFade>
      </Box>

      {isSmallOrMedium && <CameraIndicatorBox />}
      {!isSmallOrMedium && (
        <Box justify="end">
          <ChapterCameraIndicator />
        </Box>
      )}
    </Box>
  );
};
