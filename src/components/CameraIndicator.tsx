import { Box, ResponsiveContext, Text } from "grommet";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { colorTheme } from "./../theme";

export const CameraIndicator = ({
  showBorder,
  backgroundColor = "yellow",
}: {
  showBorder: boolean;
  backgroundColor?: "black" | "yellow";
}) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const margins =
    size === "small" || size === "medium"
      ? { right: "16px", top: "16px", bottom: "12px" }
      : { right: "13px", top: "12px", bottom: "12px" };
  const bottomBorderStyle = showBorder
    ? { borderBottom: `3px solid ${colorTheme.yellowAlternative}` }
    : {};
  return (
    <Box
      fill="horizontal"
      background={backgroundColor}
      flex={false}
      style={bottomBorderStyle}
    >
      <Box direction="row" justify="end" margin={margins}>
        <CameraIndicatorBox />
      </Box>
    </Box>
  );
};

const AnimatePosition = styled(Box)<{ isLeft: boolean }>`
  position: absolute;
  left: ${(props) => (props.isLeft ? "0" : "100%")};
  right: ${(props) => (props.isLeft ? "100%" : "0")};
  transform: translateX(${(props) => (!props.isLeft ? "-100%" : "0%")});
  top: 0;
  transition: all 0.2s;
`;

const AnimateMargin = styled(Box)<{ isLeft: boolean }>`
  margin-left: ${(props) => (props.isLeft ? "0" : "48px")};
  margin-right: ${(props) => (props.isLeft ? "48px" : "0")};
  transition: all 0.2s;
`;

export const CameraIndicatorBox = ({
  borderColor = "yellow",
}: {
  borderColor?: "yellow" | "black";
}) => {
  const isSmall = useContext(ResponsiveContext) === "small";
  const isOn = true;
  const onText = isSmall ? "on" : "Webcam on";
  const offText = isSmall ? "off" : "Webcam off";
  const text = isOn ? onText : offText;
  return (
    <Box
      direction="row"
      border={{ color: borderColor, size: "3px" }}
      height="48px"
      style={{ position: "relative" }}
      background="charcoal"
      className="CameraIndicatorBox"
    >
      <AnimatePosition isLeft={!isOn} width="42px">
        <CameraIcon isOn={isOn} />
      </AnimatePosition>
      <Box pad={{ horizontal: "20px", vertical: "8px" }}>
        <AnimateMargin isLeft={isOn}>
          <Text size="xsmall" color="grayLight" style={{ userSelect: "none" }}>
            {text}
          </Text>
        </AnimateMargin>
      </Box>
    </Box>
  );
};

export const ChapterCameraIndicator = () => {
  return (
    <Box fill="horizontal" flex={false}>
      <Box justify="end" gap={"16px"}>
        <CameraIndicatorBox />
        <WebcamNotification />
      </Box>
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
        top: "calc(16px + 100%)",
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

const CameraIcon = ({ isOn = false }: { isOn?: boolean }) => {
  if (isOn) {
    return <CameraIconOn />;
  } else {
    return <CameraIconOff />;
  }
};

const CameraIconOn = () => {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="42" height="42" fill="#20BF00" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
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

const CameraIconOff = () => {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="42" height="42" fill="#FF5959" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
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
        stroke-width="4"
      />
    </svg>
  );
};
