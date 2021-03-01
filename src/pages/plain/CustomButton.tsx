import { Box, Text } from "grommet";
import React, { ReactNode } from "react";
import { RoutedButton } from "../../components/RoutedAnchor";
import { Routes } from "../../Routes";
import { colorTheme } from "../../theme";

export const CustomRoutedButton = ({
  color,
  textContent,
  href,
}: {
  color: keyof typeof colorTheme;
  textContent: ReactNode;
  href: Routes;
}) => {
  return (
    <Box className="custom button" direction="row">
      <RoutedButton
        plain
        label={
          <Box
            border={{ color, style: "solid", size: "3px" }}
            pad={{ horizontal: "24px", vertical: "9px" }}
          >
            <Text size="24px" style={{ lineHeight: "100%" }} color={color}>
              {textContent}
            </Text>
          </Box>
        }
        href={href}
      />
    </Box>
  );
};
