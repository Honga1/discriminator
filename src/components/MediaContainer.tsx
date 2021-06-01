import { Box, ResponsiveContext, Text } from "grommet";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { CameraIndicatorBox, ChapterCameraIndicator } from "./CameraIndicator";
import { ChapterAndCoverNextButton } from "./ChapterAndCoverFinishedButton";
import { Timeline } from "./timeline/Timeline";
import { useIsActive } from "../hooks/useIsActive";
import { useStore } from "../store/store";
import { colorTheme } from "../theme";

export const Media = ({ children }: PropsWithChildren<{}>) => {
  return (
    <FrameBox
      fill="vertical"
      background="black"
      height={{ min: "396px" }}
      style={{ position: "relative" }}
      frameColor="yellow"
      align="center"
      overflow={"hidden"}
    >
      {children}

      <NextButton />
      <Heading />
      <Timeline />
    </FrameBox>
  );
};

function NextButton() {
  const size = useContext(ResponsiveContext);
  const isSmall = size === "small";
  return (
    <Box
      style={{
        position: "absolute",
        top: isSmall ? "69%" : "77%",
        right: 0,
      }}
    >
      <ChapterAndCoverNextButton />
    </Box>
  );
}

function Heading() {
  const isActive = useIsActive();
  const isHeadingShown = useStore((state) => state.isHeadingShown);
  const size = useContext(ResponsiveContext);
  const isSmall = size === "small";

  const isSmallOrMedium = isSmall || size === "medium";

  return (
    <Box
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        userSelect: "none",
        pointerEvents: "none",
      }}
      direction="row"
      flex={false}
      justify="between"
      align="start"
    >
      <FadeOutBox
        isShown={isHeadingShown && isActive}
        background={"yellow"}
        pad={{
          horizontal: "16px",
          vertical: "12px",
        }}
      >
        {isSmallOrMedium && <WebcamNotification />}
        <Text
          size="24px"
          color={colorTheme.black}
          style={{
            lineHeight: "100%",
          }}
        >
          Discriminator
        </Text>
      </FadeOutBox>
      <Box justify="end">
        {isSmallOrMedium && <CameraIndicatorBox />}
        {!isSmallOrMedium && <ChapterCameraIndicator />}
      </Box>
    </Box>
  );
}

const WebcamNotification = () => {
  const isNeeded = useStore((state) => state.isCameraEnabled);
  const isOn = useStore((state) => state.webcamStream !== undefined);

  const [isShown, setIsShown] = useState(isNeeded && !isOn);

  useEffect(() => {
    if (isNeeded && !isOn) {
      setIsShown(true);
    }
  }, [isNeeded, isOn]);

  useEffect(() => {
    const timeout =
      isShown &&
      setTimeout(() => {
        setIsShown(false);
      }, 3000);
    return () => {
      setIsShown(false);

      timeout && clearTimeout(timeout);
    };
  }, [isShown, isNeeded]);

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

const FadeOutBox = styled(Box)<{ isShown: boolean }>`
  opacity: ${(props) => (props.isShown ? "1" : "0")};
  transition: opacity 0.6s;
`;

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
    z-index: 10;
  }
`;
