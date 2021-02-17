import React, {
  Children,
  PropsWithChildren,
  ReactNode,
  ReactText,
} from "react";

import { StyledStack } from "grommet/components/Stack/StyledStack";
import { StackProps } from "grommet";
import styled from "styled-components";

const styleMap = {
  fill: `
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  `,
  center: `
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
  left: `
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  `,
  right: `
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  `,
  top: `
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  `,
  bottom: `
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  `,
  "top-fill": `
    top: 0;
    left: 0;
    width: 100%;
  `,
  "top-left": `
    top: 0;
    left: 0;
  `,
  "bottom-left": `
    bottom: 0;
    left: 0;
  `,
  "top-right": `
    top: 0;
    right: 0;
  `,
  "bottom-right": `
    bottom: 0;
    right: 0;
  `,
} as const;

const StyledStackLayer = styled.div<{
  guiding?: boolean;
  fillContainer?: boolean | "horizontal" | "vertical";
  interactive: boolean;
  anchor?: keyof typeof styleMap;
}>`
  position: ${(props) => (props.guiding ? "relative" : "absolute")};
  ${(props) => props.guiding && "display: block;"}
  ${(props) => !props.guiding && `${styleMap[props.anchor || "fill"]};`}
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
  interactiveChild,
  interactiveIndex,
}: {
  anchor: keyof typeof styleMap;
  fill: StackProps["fill"];
  guidingIndex: ReactText;
  interactiveChild: StackProps["interactiveChild"];
  interactiveIndex: string | number | undefined;
}) => (child: ReactNode, index: number) => {
  const interactive =
    interactiveChild === undefined || interactiveIndex === index;
  const isGuidingIndex = index === guidingIndex;
  const props = isGuidingIndex
    ? { guiding: true, fillContainer: fill }
    : { anchor };

  return (
    <StyledStackLayer key={index} interactive={interactive} {...props}>
      {child}
    </StyledStackLayer>
  );
};

export const FullWidthStack = ({
  anchor,
  children,
  fill,
  guidingChild,
  interactiveChild,
  ...rest
}: PropsWithChildren<
  Omit<StackProps, "anchor"> & { anchor: keyof typeof styleMap }
>) => {
  const prunedChildren = Children.toArray(children).filter((c) => c);
  const toChildIndex = (child: string | number | undefined) => {
    let index = child;
    if (index === "first" || !index) index = 0;
    else if (index === "last") index = prunedChildren.length - 1;
    return index;
  };

  const guidingIndex = toChildIndex(guidingChild);
  const interactiveIndex = interactiveChild && toChildIndex(interactiveChild);

  const styledChildren = prunedChildren.map(
    buildStyledChildren({
      anchor,
      fill,
      guidingIndex,
      interactiveChild,
      interactiveIndex,
    })
  );

  return (
    <StyledStack fillContainer={fill} {...rest}>
      {styledChildren}
    </StyledStack>
  );
};
