import { Box, Text } from "grommet";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { colorTheme } from "../theme";
import { RoutedButton } from "./RoutedAnchor";

const AnimatedBackground = styled(Box)<{ width: number }>`
  transition: all 1s linear;
  position: absolute;
  top: 0;
  left: 0;
  right: ${(props) => (1 - props.width) * 100}%;
  bottom: 0;
  z-index: -1;
`;

const AnimateWidthAndHover = styled(Box)`
  transition: width 1s linear, transform 0.2s;
  &:hover {
    transform: translateY(-3px);
  }
`;

export const NextButton = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (progress >= 5) return;
    const timeout = setTimeout(() => setProgress(progress + 1), 1000);
    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <RoutedButton
      plain
      href="/home"
      label={
        <AnimateWidthAndHover
          border={{ size: "3px", color: colorTheme.white }}
          style={{ zIndex: 10, position: "relative" }}
          pad={{ horizontal: "21px", vertical: "5px" }}
          width={progress < 2 ? "80px" : "286px"}
        >
          <AnimatedBackground
            background="blue"
            width={progress / 5}
          ></AnimatedBackground>
          <Box direction="row" align="center" gap="10px" overflow="hidden">
            <Box flex={false} width="32px" height="32px">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="7" y="11" width="10" height="10" fill="#F8F9FA" />
                <path d="M27 16L17 25L17 7L27 16Z" fill="#F8F9FA" />
              </svg>
            </Box>
            <Box flex={false} height="24px" overflow="hidden">
              <Text color="white" size="24px" style={{ lineHeight: "100%" }}>
                Go to next chapter
              </Text>
            </Box>
          </Box>
        </AnimateWidthAndHover>
      }
    ></RoutedButton>
  );
};
