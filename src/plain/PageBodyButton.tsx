import { Box, Button, Text } from "grommet";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { RoutedButton } from "../components/RoutedAnchor";
import { Routes } from "../Routes";
import { colorTheme } from "../theme";

const OnHoverBox = styled(Box)<{ fillColor: string }>`
  &:hover {
    background-color: ${(props) => props.fillColor};

    & > span {
      color: ${colorTheme.offWhite};
    }
  }

  & > span {
    color: ${(props) => props.fillColor};
  }

  transition: color 0.2s, background-color 0.2s;
`;

export const PageBodyButton = ({
  color,
  textContent,
  config,
  size = "small",
}: {
  config:
    | {
        type: "onClick";
        onClick: () => void;
      }
    | {
        type: "href";
        href: Routes;
      };
  color: keyof typeof colorTheme;
  textContent: ReactNode;
  size?: "large" | "small";
}) => {
  const pad =
    size === "small"
      ? { horizontal: "24px", vertical: "9px" }
      : { horizontal: "30px", vertical: "13px" };

  const label = (
    <OnHoverBox
      border={{ color, style: "solid", size: "3px" }}
      pad={pad}
      fillColor={colorTheme[color]}
    >
      <Text size="24px" style={{ lineHeight: "100%" }} color={color}>
        {textContent}
      </Text>
    </OnHoverBox>
  );

  if (config.type === "onClick") {
    return (
      <Box direction="row">
        <Button onClick={config.onClick} plain label={label} />
      </Box>
    );
  } else {
    return (
      <Box direction="row">
        <RoutedButton plain label={label} href={config.href} />
      </Box>
    );
  }
};
