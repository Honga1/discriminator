import { Box, ResponsiveContext, Text } from "grommet";
import { useContext, useEffect, useState } from "react";
import { animated, useTransition } from "react-spring";
import { colorTheme } from "src/theme";
import styled from "styled-components";
import { usePart1Screen2Store } from "../store/Part1Screen2Store";

export function ImageText({ show }: { show: boolean }) {
  const isShown = usePart1Screen2Store(
    (state) =>
      state.focusedElement !== undefined &&
      state.focusedData !== undefined &&
      show
  );

  console.log(isShown);

  const nextDescriptor = usePart1Screen2Store((state) => state.focusedData);

  const isSmall = useContext(ResponsiveContext) === "small";

  const [currentDescriptor, setCurrentDescriptor] = useState(nextDescriptor);

  useEffect(() => {
    if (isShown) {
      setCurrentDescriptor(nextDescriptor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShown]);
  const transition = useTransition(isShown, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return transition(
    (style, isShown) =>
      isShown && (
        <AnimatedBox
          style={{ ...style, textShadow: `0px 4px 4px rgba(0, 0, 0, 0.25)` }}
        >
          <StyledText small={isSmall}>&#123;</StyledText>
          <StyledText small={isSmall}>
            &nbsp;&nbsp;date: {currentDescriptor?.date},
          </StyledText>
          <StyledText small={isSmall}>
            &nbsp;&nbsp;license: {currentDescriptor?.license},
          </StyledText>
          <StyledText small={isSmall}>
            &nbsp;&nbsp;nsid: {currentDescriptor?.nsid},
          </StyledText>
          <StyledText small={isSmall}>
            &nbsp;&nbsp;path_alias: {currentDescriptor?.path_alias},
          </StyledText>

          <StyledText small={isSmall}>
            &nbsp;&nbsp;tagged: {currentDescriptor?.tagged},
          </StyledText>
          <StyledText small={isSmall}>&#125;</StyledText>
        </AnimatedBox>
      )
  );
}

const AnimatedBox = animated(Box);

const StyledText = styled(Text)<{ small: boolean }>`
  font-size: ${(props) => (props.small ? "20px" : "24px")};
  line-height: ${(props) => (props.small ? `32px` : `32px`)};
  color: ${colorTheme.offWhite};
  user-select: none;
`;
