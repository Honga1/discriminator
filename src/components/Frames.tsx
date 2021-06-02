import { Box, ResponsiveContext, Text } from "grommet";
import React, { PropsWithChildren, useContext } from "react";
import { CameraIndicatorBox } from "./CameraIndicator";
import { FullWidthStack } from "./FullWidthStack";

export const PageFrame = ({
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

  const textSize = isSmall ? "24px" : "48px";

  return (
    <Box className="frame" style={style} flex={false}>
      <Box className="heading-block" direction="row">
        <Box
          background={frameColor}
          pad={{ horizontal: isSmall ? "16px" : "20px", vertical: "12px" }}
        >
          <Text
            size={textSize}
            color={textColor}
            style={{ lineHeight: "100%" }}
          >
            {heading}
          </Text>
        </Box>
      </Box>

      {children}
    </Box>
  );
};

export const PageFrameWithCameraIndicator = ({
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
  const textSize = isSmall ? "24px" : "48px";

  return (
    <Box
      className="page frame with camera indicator"
      style={style}
      flex={false}
    >
      <FullWidthStack fill anchor="top-fill">
        <Box fill>{children}</Box>

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
            pad={{ horizontal: isSmall ? "16px" : "20px", vertical: "12px" }}
          >
            <Text
              size={textSize}
              color={textColor}
              style={{ lineHeight: "100%" }}
            >
              {heading}
            </Text>
          </Box>
          <Box>
            <CameraIndicatorBox borderColor="black" />
          </Box>
        </Box>
      </FullWidthStack>
    </Box>
  );
};
