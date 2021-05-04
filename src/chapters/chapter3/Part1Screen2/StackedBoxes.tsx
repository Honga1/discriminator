import { Box, ResponsiveContext } from "grommet";
import React, {
  memo,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import useResizeObserver from "use-resize-observer";
import { ImageCard } from "./ImageCard";
import { usePart1Screen2Store, Years } from "./Part1Screen2Store";

export const StackedBoxes = memo(({ year }: { year: Years }) => {
  const isSmall = useContext(ResponsiveContext) === "small";

  if (isSmall) {
    return <StackedBoxesHorizontal year={year} />;
  } else {
    return <StackedBoxesVertical year={year} />;
  }
});

const StackedBoxesVertical = ({ year }: { year: Years }) => {
  const amount = usePart1Screen2Store((state) => state.images[year].length);
  const [[boxWidth, boxHeight], setDimensions] = useState([1, 1 / 8]);
  const cellsPerColumn = 8;

  const columnCount = Math.ceil(amount / cellsPerColumn);

  const ref = useRef<HTMLDivElement>(null);
  const { width = 1, height = 1 } = useResizeObserver<HTMLDivElement>({
    ref,
  });

  const { BoxesLeft, BoxesRight } = useBoxes(amount, cellsPerColumn, year);

  useLayoutEffect(() => {
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
            <BoxesLeft boxHeight={boxHeight} boxWidth={boxWidth} />
          </Box>
          {columnCount === 2 && (
            <Box
              direction="column"
              height="100%"
              width="100%"
              align="center"
              justify="end"
            >
              <BoxesRight boxHeight={boxHeight} boxWidth={boxWidth} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const StackedBoxesHorizontal = ({ year }: { year: Years }) => {
  const amount = usePart1Screen2Store((state) => state.images[year].length);
  const [[boxWidth, boxHeight], setDimensions] = useState([1, 1 / 8]);
  const cellsPerRow = 8;

  const rowCount = Math.ceil(amount / cellsPerRow);

  const ref = useRef<HTMLDivElement>(null);
  const { width = 1, height = 1 } = useResizeObserver<HTMLDivElement>({
    ref,
  });

  const { BoxesLeft: BoxesUp, BoxesRight: BoxesDown } = useBoxes(
    amount,
    cellsPerRow,
    year
  );

  useLayoutEffect(() => {
    if (!ref.current) return;
    const maxWidth = 1 / cellsPerRow;
    const desiredAspect = 3 / 4;

    const rowHeight =
      ((maxWidth / desiredAspect) * width) / (height / rowCount);
    const maxHeight = 1;

    const isRowTooHigh = maxHeight <= rowHeight;

    if (isRowTooHigh) {
      const reducedWidth =
        (maxHeight * desiredAspect * height) / width / rowCount;

      const reducedWithGap = shrinkAndMaintainAspectRatio(
        reducedWidth,
        maxHeight,
        0,
        0
      );
      setDimensions(reducedWithGap);
    } else {
      const reducedWithGap = shrinkAndMaintainAspectRatio(
        maxWidth,
        rowHeight,
        0,
        0
      );

      setDimensions(reducedWithGap);
    }
  }, [rowCount, height, ref, width]);

  return (
    <Box
      width="100%"
      height="100%"
      align="start"
      pad={{ vertical: (rowCount - 1) * 16 + "px" }}
    >
      <Box ref={ref} width="100%" height="100%" align="start" direction="row">
        <Box
          width="100%"
          direction="column"
          height="100%"
          justify="center"
          align="start"
          gap="10px"
        >
          <Box
            height="100%"
            width="100%"
            align={"center"}
            justify="start"
            direction="row"
          >
            <BoxesUp boxHeight={boxHeight} boxWidth={boxWidth} />
          </Box>
          {rowCount === 2 && (
            <Box
              direction="row"
              height="100%"
              width="100%"
              align="center"
              justify="start"
            >
              <BoxesDown boxHeight={boxHeight} boxWidth={boxWidth} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

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

function useBoxes(amount: number, cellsPerColumn: number, year: Years) {
  const leftArray = useRef([...new Array(Math.min(amount, cellsPerColumn))]);
  const rightArray = useRef([
    ...new Array(Math.max(amount - Math.min(amount, cellsPerColumn), 0)),
  ]);

  const isSmall = useContext(ResponsiveContext) === "small";

  const images = usePart1Screen2Store((state) => state.images[year]);
  const BoxesColumnA = useCallback(
    ({ boxWidth, boxHeight }: { boxWidth: number; boxHeight: number }) => (
      <>
        {leftArray.current.map((_, index) => {
          const image = images[index];
          if (!image) {
            throw new Error(
              `Could not get image with index ${index} from ${images}`
            );
          }
          return (
            <Box
              key={index}
              flex={false}
              height={boxHeight * 100 + "%"}
              width={boxWidth * 100 + "%"}
            >
              <ImageCard
                width={isSmall ? 0.8 : 0.6}
                height={isSmall ? 0.8 : 0.6}
                key={index}
                image={image}
              />
            </Box>
          );
        })}
      </>
    ),
    [images, isSmall]
  );
  const BoxesRight = useCallback(
    ({ boxWidth, boxHeight }: { boxWidth: number; boxHeight: number }) => (
      <>
        {rightArray.current.map((_, index) => {
          const image = images[index + cellsPerColumn];
          if (!image) {
            throw new Error(
              `Could not get image with index ${index} from ${images}`
            );
          }
          return (
            <Box
              key={index}
              flex={false}
              height={boxHeight * 100 + "%"}
              width={boxWidth * 100 + "%"}
            >
              <ImageCard
                width={isSmall ? 0.8 : 0.6}
                height={isSmall ? 0.8 : 0.6}
                key={index}
                image={image}
              />
            </Box>
          );
        })}
      </>
    ),
    [cellsPerColumn, images, isSmall]
  );

  return { BoxesLeft: BoxesColumnA, BoxesRight };
}
