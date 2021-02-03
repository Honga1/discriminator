import { Box, ResponsiveContext } from "grommet";
import React, { PropsWithChildren, ReactNode, useContext } from "react";
import { ThemeContext } from "styled-components";

const OutlinedBox = ({
  children,
  color,
}: PropsWithChildren<{ color: "black" | "red" | "blue" | "green" }>) => {
  const size = useContext(ResponsiveContext);
  const theme = useContext(ThemeContext);
  const borderWidth = size === "small" ? 3 : 5;

  const colorValue = theme.global.colors[color];
  return (
    <Box
      style={{
        outlineOffset: `-${borderWidth}px`,
        outline: `${borderWidth}px ${colorValue} solid`,
      }}
      flex={false}
    >
      {children}
    </Box>
  );
};
export const OutlinedBoxWithHeader = ({
  children,
  heading,
  color,
}: PropsWithChildren<{
  heading: ReactNode;
  color: "black" | "red" | "blue" | "green";
}>) => {
  return (
    <OutlinedBox color={color}>
      <HeadingBlock color={color} heading={heading} />
      <Box>{children}</Box>
    </OutlinedBox>
  );
};
const HeadingBlock = ({
  heading,
  color,
}: {
  heading: ReactNode;
  color: "black" | "red" | "blue" | "green";
}) => {
  const size = useContext(ResponsiveContext);
  const rightMargin = size === "small" ? "small" : "70px";
  return (
    <Box direction="row">
      <Box
        pad={{ left: "medium", vertical: "small", right: "medium" }}
        margin={{ bottom: "large", right: rightMargin }}
        background={color}
      >
        {heading}
      </Box>
    </Box>
  );
};
