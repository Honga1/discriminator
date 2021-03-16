import { Box, Grid, ResponsiveContext, Text } from "grommet";
import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import useResizeObserver from "use-resize-observer";
import { useTimer } from "../../../hooks/useTimer";

export const Part1Screen2 = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const isSmall = useContext(ResponsiveContext) === "small";
  const [seconds] = useTimer();

  const [target, setTarget] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const elements = ref.current.getElementsByClassName("rotated-box");
    // Math.floor(Math.random() * elements.length)
    const choice = elements[0] as HTMLDivElement | undefined;

    if (!choice) return;
    const position = choice.getBoundingClientRect();

    choice.style.backgroundColor = "green";
    if (seconds % 10 === 7) {
      setTarget({
        x: -position.x,
        y: 0,
      });
    }
  }, [seconds]);

  return (
    <Box
      flex={false}
      height="100%"
      width="100%"
      justify="center"
      pad="48px"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <AnimateEverything
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        }}
        isZoomed={seconds % 10 < 5}
        target={target}
        ref={ref}
      >
        {isSmall ? <NormalLayout /> : <NormalLayout />}
      </AnimateEverything>
    </Box>
  );
});

const NormalLayout = memo(() => (
  <Grid
    fill="vertical"
    pad={"32px"}
    areas={[
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
    ]}
    columns={["flex", "flex", "flex", "flex", "flex", "flex", "flex", "flex"]}
    rows={["flex", "auto"]}
    gap={"16px"}
  >
    <Box gridArea="stackedBoxes2006" align="center">
      <StackedBoxes amount={3} />
    </Box>
    <Box gridArea="stackedBoxes2007" align="center">
      <StackedBoxes amount={6} />
    </Box>
    <Box gridArea="stackedBoxes2010" align="center">
      <StackedBoxes amount={15} />
    </Box>
    <Box gridArea="stackedBoxes2011" align="center">
      <StackedBoxes amount={16} />
    </Box>
    <Box gridArea="stackedBoxes2012" align="center">
      <StackedBoxes amount={1} />
    </Box>
    <Box gridArea="stackedBoxes2013" align="center">
      <StackedBoxes amount={5} />
    </Box>
    <Box gridArea="text2006" align="center">
      <Text color="white">2006</Text>
    </Box>
    <Box gridArea="text2007" align="center">
      <Text color="white">2007</Text>
    </Box>
    <Box gridArea="text2010" align="center">
      <Text color="white">2010</Text>
    </Box>
    <Box gridArea="text2011" align="center">
      <Text color="white">2011</Text>
    </Box>
    <Box gridArea="text2012" align="center">
      <Text color="white">2012</Text>
    </Box>
    <Box gridArea="text2013" align="center">
      <Text color="white">2013</Text>
    </Box>
  </Grid>
));

const AnimateEverything = styled(Box)<{
  isZoomed: boolean;
  target: { x: number; y: number };
}>`
  transition: all 1s ease-out;
  transform: ${(props) =>
    !props.isZoomed
      ? `matrix(1, 0, 0, 1, 0, 0)`
      : `matrix(2, 0, 0, 2, ${props.target.x}, ${props.target.y})`};
`;

const StackedBoxes = memo(({ amount }: { amount: number }) => {
  const [[boxWidth, boxHeight], setDimensions] = useState([1, 1 / 8]);
  const cellsPerColumn = 8;
  console.log("render2");

  const columnCount = Math.ceil(amount / cellsPerColumn);

  const ref = useRef<HTMLDivElement>(null);
  const { width = 1, height = 1 } = useResizeObserver<HTMLDivElement>({ ref });

  const boxesLeft = useMemo(
    () =>
      [...new Array(Math.min(amount, cellsPerColumn))].map((_, index) => (
        <RotatedBox width={boxWidth} height={boxHeight} key={index} />
      )),
    [amount, boxHeight, boxWidth]
  );
  const boxesRight = useMemo(
    () =>
      [
        ...new Array(Math.max(amount - Math.min(amount, cellsPerColumn), 0)),
      ].map((_, index) => (
        <RotatedBox width={boxWidth} height={boxHeight} key={index} />
      )),
    [amount, boxHeight, boxWidth]
  );

  useEffect(() => {
    if (!ref.current) return;
    const maxHeight = 1 / cellsPerColumn;
    const desiredAspect = 4 / 3;

    // First try fit by scaling width
    const columnWidth =
      (maxHeight * desiredAspect * height) / (width / columnCount);
    const maxWidth = 1;

    const isColumnTooWide = maxWidth <= columnWidth;

    if (isColumnTooWide) {
      const reducedHeight =
        ((maxWidth / desiredAspect) * width) / height / columnCount;

      const reducedWithGap = shrinkAndMaintainAspectRatio(
        maxWidth,
        reducedHeight,
        0,
        0
      );
      setDimensions(reducedWithGap);
    } else {
      const reducedWithGap = shrinkAndMaintainAspectRatio(
        columnWidth,
        maxHeight,
        0,
        0
      );

      setDimensions(reducedWithGap);
    }
  }, [columnCount, height, ref, width]);

  return (
    <Box
      width="100%"
      height="100%"
      align="end"
      pad={{ horizontal: (columnCount - 1) * 16 + "px" }}
    >
      <Box ref={ref} width="100%" height="100%" align="end">
        <Box
          width="100%"
          direction="row"
          height="100%"
          justify="center"
          align="end"
          gap="10px"
        >
          <Box height="100%" width="100%" align={"center"} justify="end">
            {boxesLeft}
          </Box>
          {columnCount === 2 && (
            <Box
              direction="column"
              height="100%"
              width="100%"
              align="center"
              justify="end"
            >
              {boxesRight}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
});

const RotatedBox = memo(
  ({ width, height }: { width: number; height: number }) => (
    <Box
      className="rotated-box"
      flex={false}
      width={width * 100 + "%"}
      height={height * 100 + "%"}
      style={{ position: "relative" }}
    >
      <Box
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: "absolute",
          transform: `rotate(${Math.random() * 180 - 90}deg)`,
        }}
        border={{ size: "2px", color: "#FF4E4E" }}
        background="rgba(255, 89, 89, 0.2)"
      ></Box>
    </Box>
  )
);

const shrinkAndMaintainAspectRatio = (
  width: number,
  height: number,
  shrinkWidth: number,
  shrinkHeight: number
): [width: number, height: number] => {
  const reducedWidth = width - shrinkWidth;
  const reducedHeight = height - shrinkHeight;

  const originalAspectRatio = width / height;

  const newAspect = reducedWidth / reducedHeight;
  if (newAspect > originalAspectRatio) {
    return [reducedHeight * originalAspectRatio, reducedHeight];
  } else {
    return [reducedWidth, reducedWidth / originalAspectRatio];
  }
};
