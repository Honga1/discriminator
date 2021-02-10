import React, { Children, PropsWithChildren } from "react";

import { StyledStack } from "grommet/components/Stack/StyledStack";
import { StackProps } from "grommet";
import styled from "styled-components";

const StyledStackLayer = styled.div<{
  guiding?: boolean;
  fillContainer?: boolean | "horizontal" | "vertical";
  interactive: boolean;
}>`
  position: ${(props) => (props.guiding ? "relative" : "absolute")};
  ${(props) => props.guiding && "display: block;"}
  ${(props) =>
    !props.guiding &&
    `
  top: 0;
  left: 0;
  right: 0;
`}
  ${(props) =>
    props.fillContainer &&
    `
    width: 100%;
    height: 100%;
  `}
  ${(props) => !props.interactive && `pointer-events: none;`}
`;

const buildStyledChildren = ({
  anchor,
  fill,
  guidingIndex,
}: {
  anchor: StackProps["anchor"];
  fill: StackProps["fill"];
  guidingIndex: number;
}) => (child: any, index: string | number | null | undefined) => {
  const isGuidingIndex = index === guidingIndex;
  const props = isGuidingIndex ? { guiding: true, fillContainer: fill } : {};

  return (
    <StyledStackLayer key={index} interactive={true} {...props}>
      {child}
    </StyledStackLayer>
  );
};

export const InteractiveStack = ({
  anchor,
  children,
  fill,
  guidingChild,
  ...rest
}: PropsWithChildren<Omit<StackProps, "interactiveChild">>) => {
  const prunedChildren = Children.toArray(children).filter((c) => c);
  const toChildIndex = (child: number | "first" | "last" | undefined) => {
    let index = child;
    if (index === "first" || !index) index = 0;
    else if (index === "last") index = prunedChildren.length - 1;
    return index;
  };

  const guidingIndex = toChildIndex(guidingChild);

  const styledChildren = prunedChildren.map((child, index) => {
    return buildStyledChildren({
      anchor,
      fill,
      guidingIndex,
    })(child, index);
  });

  return (
    <StyledStack fillContainer={fill} {...rest}>
      {styledChildren}
    </StyledStack>
  );
};
