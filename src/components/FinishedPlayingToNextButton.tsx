import { Box, Text } from "grommet";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { usePageType } from "../hooks/usePageType";
import { colorTheme } from "../theme";
import { NextStepButton } from "./NextStepButton";
import { useNextStep } from "../hooks/useNextStep";
import { useIsActive } from "../hooks/useIsActive";
import { useStore } from "../store/store";

const AnimatedBackground = styled(Box)<{ styledWidth: number }>`
  transition: right 1s linear;
  position: absolute;
  top: 0;
  left: 0;
  right: ${(props) => (1 - props.styledWidth) * 100}%;
  bottom: 0;
  z-index: -1;
`;

const AnimateWidthAndHover = styled(Box)<{
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

export const FinishedPlayingToNextButton = () => {
  const [progress, setProgress] = useState(0);
  const pageType = usePageType();
  const nextStep = useNextStep();
  const isActive = useIsActive();
  const isChapterComplete = useStore((state) => state.chapter?.progress === 1);
  const shouldShow = pageType === "cover" || isChapterComplete;

  useEffect(() => {
    if (isActive || !shouldShow) return;
    if (progress >= 6) {
      return;
    }
    const timeout = setTimeout(() => {
      if (progress >= 5) {
        setProgress(0);
        nextStep();
      } else {
        setProgress(progress + 1);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [progress, nextStep, isActive, shouldShow]);

  const text = pageType === "cover" ? "Go to chapter" : "Go to next chapter";
  const width = pageType === "cover" ? "235px" : "286px";

  return (
    <Box style={shouldShow ? {} : { display: "none" }}>
      <NextStepButton
        plain
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
