import { Box, Button, Text } from "grommet";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { colorTheme } from "../theme";

export const FinishedButton = (props: {
  text: string;
  textWidth: string;
  shouldShow: boolean;
  shouldProgress: boolean;
  toProgress?: () => void;
}) => {
  const [progress, setProgress] = useState(0);
  const shouldShow = props.shouldShow;

  useEffect(() => {
    if (!props.shouldProgress) return;
    if (progress >= 6) {
      return;
    }
    const timeout = setTimeout(() => {
      if (progress >= 5) {
        setProgress(0);
        props.toProgress?.();
      } else {
        setProgress(progress + 1);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [progress, props.toProgress, props]);

  const text = props.text;
  const width = props.textWidth;

  return (
    <Box style={shouldShow ? {} : { display: "none" }}>
      <Button
        plain
        onClick={props.toProgress}
        label={
          <AnimateWidthAndHover
            border={{ size: "3px", color: colorTheme.white }}
            style={{ zIndex: 10, position: "relative" }}
            pad={{ horizontal: "21px", vertical: "5px" }}
            currentWidth={progress < 2 ? "80px" : width}
            fullWidth={width}
            background={{ color: "black", opacity: 0.9 }}
          >
            <AnimatedBackground
              background="blue"
              styledWidth={progress / 5}
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
                  {text}
                </Text>
              </Box>
            </Box>
          </AnimateWidthAndHover>
        }
      />
    </Box>
  );
};

export const AnimatedBackground = styled(Box)<{ styledWidth: number }>`
  transition: right 1s linear;
  position: absolute;
  top: 0;
  left: 0;
  right: ${(props) => (1 - props.styledWidth) * 100}%;
  bottom: 0;
  z-index: -1;
`;

export const AnimateWidthAndHover = styled(Box)<{
  currentWidth: string;
  fullWidth: string;
}>`
  transition: width 1s linear, transform 0.2s;
  width: ${(props) => props.currentWidth};
  &:hover {
    transition: width 0.6s;
    width: ${(props) => props.fullWidth};
  }
`;
