import { Box, Button, ResponsiveContext, Text } from "grommet";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useIsActive } from "../hooks/useIsActive";
import { store, useStore } from "../store/store";
import { colorTheme } from "../theme";

export const CameraIndicatorBox = ({
  borderColor = "yellow",
}: {
  borderColor?: "yellow" | "black";
}) => {
  const isSmall = useContext(ResponsiveContext) === "small";
  const isOn = useStore((state) => state.webcamStream !== undefined);
  const isActive = useIsActive();
  const toggleCamera = useStore((state) => state.toggleCamera);

  const isCameraEnabled = useStore((state) => state.isCameraEnabled);

  if (!isCameraEnabled) {
    return <DisabledCameraBox borderColor={borderColor} />;
  }
  if (isSmall) {
    return <CameraIndicatorBoxSmall borderColor={borderColor} />;
  }

  const onText = "Webcam on";
  const offText = "Webcam off";
  const text = isOn ? onText : offText;
  const width = "186px";

  return (
    <Button
      style={{ pointerEvents: "all" }}
      plain
      onClick={() => toggleCamera()}
      label={
        <AnimateWidthAndHover
          currentWidth={!isActive ? "48px" : width}
          fullWidth={width}
          direction="row"
          border={{ color: borderColor, size: "3px" }}
          height="48px"
          style={{ position: "relative" }}
          background="charcoal"
          className="CameraIndicatorBox"
          align="center"
          overflow="hidden"
        >
          <AnimatePosition flex={false} isLeft={!isOn} width="42px">
            <CameraIcon />
          </AnimatePosition>
          <AnimateMargin
            pad={{ horizontal: "20px", vertical: "8px" }}
            isLeft={isOn}
            flex={false}
            height="18px"
            justify="center"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <Text
              size="18px"
              color="grayLight"
              style={{ userSelect: "none", lineHeight: "18px" }}
            >
              {text}
            </Text>
          </AnimateMargin>
        </AnimateWidthAndHover>
      }
    />
  );
};

const CameraIndicatorBoxSmall = ({
  borderColor = "yellow",
}: {
  borderColor?: "yellow" | "black";
}) => {
  return (
    <Button
      style={{ pointerEvents: "all" }}
      plain
      onClick={store.getState().toggleCamera}
      label={
        <Box
          direction="row"
          border={{ color: borderColor, size: "3px" }}
          height="48px"
          style={{ position: "relative" }}
          background="charcoal"
          className="CameraIndicatorBox"
          align="center"
          overflow="hidden"
        >
          <Box flex={false} width="42px">
            <CameraIcon />
          </Box>
        </Box>
      }
    ></Button>
  );
};

function DisabledCameraBox({
  borderColor = "yellow",
}: {
  borderColor?: "yellow" | "black";
}) {
  return (
    <Box fill="horizontal" flex={false}>
      <Box justify="end" gap={"16px"}>
        <CameraIndicatorBoxSmall borderColor={borderColor} />
      </Box>
    </Box>
  );
}

export const ChapterCameraIndicator = () => {
  const isCameraEnabled = useStore((state) => state.isCameraEnabled);

  if (isCameraEnabled) {
    return (
      <Box fill="horizontal" flex={false}>
        <Box justify="end" gap={"16px"}>
          <CameraIndicatorBox />
          <WebcamNotification />
          <WebcamDisabledInSystem />
        </Box>
      </Box>
    );
  } else {
    return <DisabledCameraBox />;
  }
};

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
      timeout && clearTimeout(timeout);
    };
  }, [isShown]);

  return (
    <FadeOutBox
      isShown={isShown}
      flex={false}
      style={{
        position: "absolute",
        top: "calc(16px + 100%)",
        right: 0,
        zIndex: 1,
        width: "186px",
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

const WebcamDisabledInSystem = () => {
  const isShown = useStore((state) => state.webcamDisabledInSystemNotification);

  useEffect(() => {
    const timeout =
      isShown &&
      setTimeout(() => {
        store.setState({ webcamDisabledInSystemNotification: false });
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
        top: "calc(16px + 100%)",
        right: 0,
        zIndex: 1,
        width: "186px",
      }}
      background={"black"}
      pad="10px"
      border={{ color: "red", size: "3px" }}
    >
      <Text size="xsmall" color="offWhite">
        Something went wrong enabling your webcam. Try re-enable your camera in
        the browser.
      </Text>
    </FadeOutBox>
  );
};

const CameraIcon = () => {
  const isCameraEnabled = useStore((state) => state.isCameraEnabled);
  const isOn = useStore((state) => state.webcamStream !== undefined);

  return (
    <TwoElementCrossFade
      isFirstShown={isOn}
      width="42px"
      height="42px"
      flex={false}
    >
      <Box className="first">
        <CameraIconOn disabled={!isCameraEnabled} />
      </Box>
      <Box className="last">
        <CameraIconOff disabled={!isCameraEnabled} />
      </Box>
    </TwoElementCrossFade>
  );
};

const CameraIconOn = ({ disabled = false }: { disabled?: boolean }) => {
  return (
    <svg
      width="42px"
      height="42px"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="42"
        height="42"
        fill={disabled ? colorTheme.lightGrey : "#20BF00"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 12.7C9.89543 12.7 9 13.5954 9 14.7V29.9C9 31.0046 9.89543 31.9 11 31.9H31C32.1046 31.9 33 31.0046 33 29.9V14.7C33 13.5954 32.1046 12.7 31 12.7H11ZM21 28C24.3137 28 27 25.3137 27 22C27 18.6863 24.3137 16 21 16C17.6863 16 15 18.6863 15 22C15 25.3137 17.6863 28 21 28Z"
        fill="#202122"
      />
      <path
        d="M15 13C15 10.7909 16.7909 9 19 9H23C25.2091 9 27 10.7909 27 13H15Z"
        fill="#202122"
      />
      <circle cx="21" cy="22" r="4" fill="#202122" />
    </svg>
  );
};

const CameraIconOff = ({ disabled = false }: { disabled?: boolean }) => {
  return (
    <svg
      width="42px"
      height="42px"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="42"
        height="42"
        fill={disabled ? colorTheme.lightGrey : "#FF5959"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 12.7C9.89543 12.7 9 13.5954 9 14.7V29.9C9 31.0045 9.89543 31.9 11 31.9H31C32.1046 31.9 33 31.0045 33 29.9V14.7C33 13.5954 32.1046 12.7 31 12.7H11ZM21 28C24.3137 28 27 25.3137 27 22C27 18.6862 24.3137 16 21 16C17.6863 16 15 18.6862 15 22C15 25.3137 17.6863 28 21 28Z"
        fill="#202122"
      />
      <path
        d="M15 13C15 10.7909 16.7909 9 19 9H23C25.2091 9 27 10.7909 27 13H15Z"
        fill="#202122"
      />
      <circle cx="21" cy="22" r="4" fill="#202122" />
      <line
        x1="8.58579"
        y1="34.0416"
        x2="34.0416"
        y2="8.58575"
        stroke="#202122"
        strokeWidth="4"
      />
    </svg>
  );
};

const FadeOutBox = styled(Box)<{ isShown: boolean }>`
  opacity: ${(props) => (props.isShown ? "1" : "0")};
  transition: opacity 0.6s;
`;

const AnimatePosition = styled(Box)<{ isLeft: boolean }>`
  position: absolute;
  left: ${(props) => (props.isLeft ? "0" : "100%")};
  right: ${(props) => (props.isLeft ? "100%" : "0")};
  transform: translateX(${(props) => (!props.isLeft ? "-100%" : "0%")});
  top: 0;
  transition: left 0.2s, right 0.2s, transform 0.2s;
`;

const AnimateMargin = styled(Box)<{ isLeft: boolean }>`
  margin-left: ${(props) => (props.isLeft ? "0" : "48px")};
  margin-right: ${(props) => (props.isLeft ? "48px" : "0")};
  transition: margin-left 0.2s, margin-right 0.2s;
`;

const AnimateWidthAndHover = styled(Box)<{
  currentWidth: string;
  fullWidth: string;
}>`
  transition: width 0.2s linear;
  width: ${(props) => props.currentWidth};
  &:hover {
    width: ${(props) => props.fullWidth};
  }
`;

const TwoElementCrossFade = styled(Box)<{ isFirstShown: boolean }>`
  & > .first {
    position: relative;
    transition: opacity 0.2s;
    opacity: ${(props) => (props.isFirstShown ? "1" : "0")};
    width: 100%;
  }

  & > .last {
    position: absolute;
    transition: opacity 0.2s;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    opacity: ${(props) => (props.isFirstShown ? "0" : "1")};
  }
`;
