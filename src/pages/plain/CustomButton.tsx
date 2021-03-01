import { Box, ResponsiveContext, Text } from "grommet";
import React, { ReactNode, useContext } from "react";
import { colorTheme } from "../../theme";
import { QueryButton, RoutedButton } from "../../components/RoutedAnchor";
import { Routes } from "../../Routes";

export const CustomRoutedButton = ({
  color,
  textContent,
  href,
}: {
  color: keyof typeof colorTheme;
  textContent: ReactNode;
  href: Routes;
}) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  return (
    <Box className="custom button" direction="row">
      <RoutedButton
        plain
        label={
          <Box
            border={{ color, style: "solid", size: "3px" }}
            pad={{ horizontal: "27px", vertical: "7px" }}
          >
            <Text size={size === "small" ? "small" : "medium"} color={color}>
              {textContent}
            </Text>
          </Box>
        }
        href={href}
      />
    </Box>
  );
};
