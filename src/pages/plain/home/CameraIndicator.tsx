import { Box, ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";
import { colorTheme } from "../../../components/colorTheme";

export const CameraIndicator = ({ showBorder }: { showBorder: boolean }) => {
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
      background="yellow"
      flex={false}
      style={bottomBorderStyle}
    >
      <Box direction="row" justify="end" margin={margins}>
        <Box
          background="redLight"
          pad={{ horizontal: "20px", vertical: "10px" }}
        >
          <Text size="small" color="grayLight">
            Camera
          </Text>
        </Box>
        <Box
          background="charcoal"
          pad={{ horizontal: "20px", vertical: "10px" }}
        >
          <Text size="small" color="grayLight">
            off
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
