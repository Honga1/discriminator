import { Box, ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";
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
    ? { borderBottom: `4px solid ${colorTheme.yellowAlternative}` }
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

const CameraIndicatorBox = () => {
  return (
    <Box direction="row" border={{ color: "yellow", size: "3px" }}>
      <Box background="redLight">
        <CameraIcon />
      </Box>
      <Box
        background="charcoal"
        pad={{ right: "17px", left: "20px", vertical: "7px" }}
      >
        <Text size="small" color="grayLight">
          off
        </Text>
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

const WebcamNotification = () => {
  return (
    <Box
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
    </Box>
  );
};

const CameraIcon = () => {
  return (
    <Box background="redLight">
      <svg
        width="49"
        height="49"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M16 17.7002C14.8954 17.7002 14 18.5956 14 19.7002V34.9002C14 36.0048 14.8954 36.9002 16 36.9002H36C37.1046 36.9002 38 36.0048 38 34.9002V19.7002C38 18.5956 37.1046 17.7002 36 17.7002H16ZM26 33.0002C29.3137 33.0002 32 30.3139 32 27.0002C32 23.6865 29.3137 21.0002 26 21.0002C22.6863 21.0002 20 23.6865 20 27.0002C20 30.3139 22.6863 33.0002 26 33.0002Z"
          fill="#202122"
        />
        <path
          d="M20 18C20 15.7909 21.7909 14 24 14H28C30.2091 14 32 15.7909 32 18H20Z"
          fill="#202122"
        />
        <circle cx="26" cy="27" r="4" fill="#202122" />
      </svg>
    </Box>
  );
};
