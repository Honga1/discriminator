import { Box, Grid, ResponsiveContext } from "grommet";
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import useResizeObserver from "use-resize-observer";
import { ImageCard } from "./ImageCard";
import { usePart3Store, Tinting, part3Store } from "../store/Part3Store";
import { MegafaceImageDescriptor } from "../../Part1Screen2/store/Part1Screen2Store";

export const PiledBoxes = memo(({ tinting }: { tinting: Tinting }) => {
  const isSmall = useContext(ResponsiveContext) === "small";

  if (isSmall) {
    return <PiledBoxesHorizontal tinting={tinting} />;
  } else {
    return <PiledBoxesVertical tinting={tinting} />;
  }
});

const PiledBoxesVertical = ({ tinting }: { tinting: Tinting }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log(part3Store.getState());
  });
  const images = usePart3Store((state) => state.images[tinting]);

  const { width = 1, height = 4 / 3 } = useResizeObserver({ ref: ref });

  const closestSquare = Math.ceil(Math.sqrt(images.length));
  const distortedWidth = (closestSquare * height) / width;
  const closestHeight = Math.floor(distortedWidth);
  const closestWidth = Math.floor(
    (closestSquare * closestSquare) / closestHeight
  );
  const rowArray = Array.from({ length: closestHeight });
  const columnArray = Array.from({ length: closestWidth });

  const topPopFrom = [...images];

  const center = Math.floor((closestWidth * closestHeight) / 2);
  const fillArray: Array<MegafaceImageDescriptor | undefined> = Array.from({
    length: closestWidth * closestHeight,
  });

  fillArray.forEach((_, index) => {
    const shouldGetLeft = index % 2 === 0;
    if (shouldGetLeft) {
      const placeIndex = center - index / 2;
      fillArray[placeIndex] = topPopFrom.pop();
    } else {
      const placeIndex = center + (index + 1) / 2;
      fillArray[placeIndex] = topPopFrom.pop();
    }
  });

  return (
    <Grid
      ref={ref}
      fill
      rows={[...rowArray].map(() => "flex")}
      columns={[...columnArray].map(() => "flex")}
    >
      {fillArray.map((image, index) => {
        const x = index % closestWidth;
        const y = Math.floor(index / closestHeight);

        const distanceFromCenterX = (closestWidth / 2 - x) / closestWidth;
        const distanceFromCenterY = (closestHeight / 2 - y) / closestHeight;

        return (
          <Box
            flex={false}
            key={index}
            width="100%"
            height="100%"
            style={{
              transform: `translate(${
                Math.sign(distanceFromCenterX) *
                Math.hypot(distanceFromCenterX, distanceFromCenterY) ** 0.1 *
                20
              }%, ${
                Math.sign(distanceFromCenterY) *
                Math.hypot(distanceFromCenterX, distanceFromCenterY) ** 0.1 *
                20
              }%)`,
            }}
          >
            {image !== undefined && (
              <ImageCard width={1} height={1} image={image}></ImageCard>
            )}
          </Box>
        );
      })}
    </Grid>
  );

  // const [[boxWidth, boxHeight], setDimensions] = useState([1, 1 / 8]);
  // const cellsPerColumn = 8;

  // const columnCount = Math.ceil(amount / cellsPerColumn);

  // const ref = useRef<HTMLDivElement>(null);
  // const { width = 1, height = 1 } = useResizeObserver<HTMLDivElement>({
  //   ref,
  // });

  // const { BoxesLeft, BoxesRight } = useBoxes(amount, cellsPerColumn, tinting);

  // useLayoutEffect(() => {
  //   if (!ref.current) return;
  //   const maxHeight = 1 / cellsPerColumn;
  //   const desiredAspect = 4 / 3;

  //   // First try fit by scaling width
  //   const columnWidth =
  //     (maxHeight * desiredAspect * height) / (width / columnCount);
  //   const maxWidth = 1;

  //   const isColumnTooWide = maxWidth <= columnWidth;

  //   if (isColumnTooWide) {
  //     const reducedHeight =
  //       ((maxWidth / desiredAspect) * width) / height / columnCount;

  //     const reducedWithGap = shrinkAndMaintainAspectRatio(
  //       maxWidth,
  //       reducedHeight,
  //       0,
  //       0
  //     );
  //     setDimensions(reducedWithGap);
  //   } else {
  //     const reducedWithGap = shrinkAndMaintainAspectRatio(
  //       columnWidth,
  //       maxHeight,
  //       0,
  //       0
  //     );

  //     setDimensions(reducedWithGap);
  //   }
  // }, [columnCount, height, ref, width]);

  // return (
  //   <Box
  //     width="100%"
  //     height="100%"
  //     align="end"
  //     pad={{ horizontal: (columnCount - 1) * 16 + "px" }}
  //   >
  //     <Box ref={ref} width="100%" height="100%" align="end">
  //       <Box
  //         width="100%"
  //         direction="row"
  //         height="100%"
  //         justify="center"
  //         align="end"
  //         gap="10px"
  //       >
  //         <Box height="100%" width="100%" align={"center"} justify="end">
  //           <BoxesLeft boxHeight={boxHeight} boxWidth={boxWidth} />
  //         </Box>
  //         {columnCount === 2 && (
  //           <Box
  //             direction="column"
  //             height="100%"
  //             width="100%"
  //             align="center"
  //             justify="end"
  //           >
  //             <BoxesRight boxHeight={boxHeight} boxWidth={boxWidth} />
  //           </Box>
  //         )}
  //       </Box>
  //     </Box>
  //   </Box>
  // );
};

const PiledBoxesHorizontal = ({ tinting }: { tinting: Tinting }) => {
  const amount = usePart3Store((state) => state.images[tinting].length);
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
    tinting
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

function useBoxes(amount: number, cellsPerColumn: number, tinting: Tinting) {
  const leftArray = useRef([...new Array(Math.min(amount, cellsPerColumn))]);
  const rightArray = useRef([
    ...new Array(Math.max(amount - Math.min(amount, cellsPerColumn), 0)),
  ]);

  const isSmall = useContext(ResponsiveContext) === "small";

  const images = usePart3Store((state) => state.images[tinting]);
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
                width={isSmall ? 0.9 : 0.6}
                height={isSmall ? 0.9 : 0.6}
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
                width={isSmall ? 0.9 : 0.6}
                height={isSmall ? 0.9 : 0.6}
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
