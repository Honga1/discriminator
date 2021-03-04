import { Box, Text } from "grommet";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { RoutedButton } from "../../components/RoutedAnchor";
import { Routes } from "../../Routes";
import { colorTheme } from "../../theme";

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

  transition: all 0.2s;
`;

export const PageBodyButton = ({
  color,
  textContent,
  href,
  onClick,
  size = "small",
}: {
  onClick?: () => void;
  color: keyof typeof colorTheme;
  textContent: ReactNode;
  href: Routes;
  size?: "large" | "small";
}) => {
  const pad =
    size === "small"
      ? { horizontal: "24px", vertical: "9px" }
      : { horizontal: "30px", vertical: "13px" };

  return (
    <Box className="custom button" direction="row">
      <RoutedButton
        onClick={onClick}
        plain
        label={
          <OnHoverBox
            border={{ color, style: "solid", size: "3px" }}
            pad={pad}
            fillColor={colorTheme[color]}
          >
            <Text size="24px" style={{ lineHeight: "100%" }} color={color}>
              {textContent}
            </Text>
          </OnHoverBox>
        }
        href={href}
      />
    </Box>
  );
};
