import { Box, ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";
import styled from "styled-components";
import { StackedBoxes } from "./StackedBoxes";
import { useImages } from "./useImages";

export const yearsInShownOrder = [2011, 2010, 2007, 2013, 2006, 2012] as const;
const yearInConsecutiveOrder = [2006, 2007, 2010, 2011, 2012, 2013] as const;
export const smallGridAreas = [
  { name: "stackedBoxes2006", start: [1, 0], end: [1, 0] },
  { name: "stackedBoxes2007", start: [1, 1], end: [1, 1] },
  { name: "stackedBoxes2010", start: [1, 2], end: [1, 3] },
  { name: "stackedBoxes2011", start: [1, 4], end: [1, 5] },
  { name: "stackedBoxes2012", start: [1, 6], end: [1, 6] },
  { name: "stackedBoxes2013", start: [1, 7], end: [1, 7] },
  { name: "text2006", start: [0, 0], end: [0, 0] },
  { name: "text2007", start: [0, 1], end: [0, 1] },
  { name: "text2010", start: [0, 2], end: [0, 3] },
  { name: "text2011", start: [0, 4], end: [0, 5] },
  { name: "text2012", start: [0, 6], end: [0, 6] },
  { name: "text2013", start: [0, 7], end: [0, 7] },
];
export const largeGridAreas = [
  { name: "stackedBoxes2006", start: [0, 0], end: [0, 0] },
  { name: "stackedBoxes2007", start: [1, 0], end: [1, 0] },
  { name: "stackedBoxes2010", start: [2, 0], end: [3, 0] },
  { name: "stackedBoxes2011", start: [4, 0], end: [5, 0] },
  { name: "stackedBoxes2012", start: [6, 0], end: [6, 0] },
  { name: "stackedBoxes2013", start: [7, 0], end: [7, 0] },
  { name: "text2006", start: [0, 1], end: [0, 1] },
  { name: "text2007", start: [1, 1], end: [1, 1] },
  { name: "text2010", start: [2, 1], end: [3, 1] },
  { name: "text2011", start: [4, 1], end: [5, 1] },
  { name: "text2012", start: [6, 1], end: [6, 1] },
  { name: "text2013", start: [7, 1], end: [7, 1] },
];
export const smallGridRows = [
  "flex",
  "flex",
  "flex",
  "flex",
  "flex",
  "flex",
  "flex",
  "flex",
];
export const smallGridColumns = ["auto", "flex"];
export const largeGridColumns = smallGridRows;
export const largeGridRows = [...smallGridColumns].reverse();
export function getZoomPosition(
  xGoal: number,
  yGoal: number,
  target: EventTarget | null,
  clientX: number,
  clientY: number,
  scaleGoal: number,
  nextScale: number
) {
  const containerBB = (target as HTMLElement | null)?.getBoundingClientRect();

  const relativeMouseX = clientX - containerBB!.left - containerBB!.width / 2;
  const relativeMouseY = clientY - containerBB!.top - containerBB!.height / 2;

  const worldMouseX = relativeMouseX / scaleGoal;
  const worldMouseY = relativeMouseY / scaleGoal;

  const offsetFromCameraX = xGoal - worldMouseX;
  const offsetFromCameraY = yGoal - worldMouseY;

  const nextMouseOffsetX = xGoal - relativeMouseX / nextScale;
  const nextMouseOffsetY = yGoal - relativeMouseY / nextScale;

  const deltaMovementX = offsetFromCameraX - nextMouseOffsetX;
  const deltaMovementY = offsetFromCameraY - nextMouseOffsetY;

  const resultX = xGoal + deltaMovementX;
  const resultY = yGoal + deltaMovementY;
  return { resultX, resultY };
}
export function GridBoxes({
  yearsShown,
  tinting,
}: {
  yearsShown: Set<2011 | 2010 | 2007 | 2013 | 2006 | 2012>;
  tinting: { wedding: boolean; family: boolean; party: boolean };
}) {
  const isSmall = useContext(ResponsiveContext) === "small";
  const images = useImages();
  return (
    <>
      {yearInConsecutiveOrder.map((year) => (
        <SlideBox
          key={year}
          slideDirection={isSmall ? "LEFT" : "DOWN"}
          gridArea={`stackedBoxes${year}`}
          align="center"
          isShown={yearsShown.has(year)}
        >
          <StackedBoxes images={images[year]} tinting={tinting} />
        </SlideBox>
      ))}
    </>
  );
}
const SlideBox = styled(Box)<{
  isShown: boolean;
  slideDirection: "DOWN" | "LEFT";
}>`
  opacity: ${(props) => (props.isShown ? "1" : "0")};
  transition: opacity 0.4s linear 0.2s,
    transform 0.6s cubic-bezier(0.42, 0, 0.71, 1.33) 0s;

  transform: ${({ isShown, slideDirection }) => {
    if (slideDirection === "LEFT") {
      return !isShown ? `translateX(20%)` : "translateX(0)";
    } else {
      return !isShown ? `translateY(-20%)` : "translateY(0)";
    }
  }};
`;
export function GridTextLabels({
  yearsShown,
}: {
  yearsShown: Set<2006 | 2007 | 2010 | 2011 | 2012 | 2013>;
}) {
  return (
    <>
      {yearInConsecutiveOrder.map((year) => {
        return (
          <FadeInBox
            key={year}
            gridArea={`text${year}`}
            align="center"
            justify="center"
            isShown={yearsShown.has(year)}
          >
            <Text
              size="24px"
              style={{ lineHeight: "72px" }}
              color="white"
              textAlign="center"
            >
              {year}
            </Text>
          </FadeInBox>
        );
      })}
    </>
  );
}
const FadeInBox = styled(Box)<{ isShown: boolean }>`
  opacity: ${(props) => (props.isShown ? "1" : "0")};
  transition: opacity 1s;
`;
