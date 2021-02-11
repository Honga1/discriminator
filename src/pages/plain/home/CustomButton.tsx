import { Box, ResponsiveContext, Text } from "grommet";
import React, { ReactNode, useContext } from "react";
import { colorTheme } from "../../../components/colorTheme";
import { QueryButton, RoutedButton } from "../../../components/RoutedAnchor";
import { Routes } from "../../../Routes";

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
    <RoutedButton
      plain
      label={
        <Box className="custom button" direction="row">
          <Box
            border={{ color, style: "solid", size: "3px" }}
            pad={{ horizontal: "27px", vertical: "7px" }}
          >
            <Text size={size === "small" ? "small" : "medium"} color={color}>
              {textContent}
            </Text>
          </Box>
        </Box>
      }
      href={href}
    />
  );
};

export const CustomQueryButton = ({
  color,
  textContent,
  query,
}: {
  color: keyof typeof colorTheme;
  textContent: ReactNode;
  query: {
    key: "modal";
    value: "about" | "privacy" | "credits";
    operation: "open" | "close";
  };
}) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  return (
    <QueryButton
      query={query}
      plain
      label={
        <Box className="custom button" direction="row">
          <Box
            border={{ color, style: "solid", size: "3px" }}
            pad={{ horizontal: "27px", vertical: "7px" }}
          >
            <Text size={size === "small" ? "small" : "medium"} color={color}>
              {textContent}
            </Text>
          </Box>
        </Box>
      }
    />
  );
};
