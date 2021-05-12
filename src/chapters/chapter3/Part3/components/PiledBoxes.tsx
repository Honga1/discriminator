import { Box, Grid, ResponsiveContext } from "grommet";
import React, { memo, useContext, useMemo, useRef } from "react";
import { useScreenAspect } from "src/hooks/useScreenAspect";
import useResizeObserver from "use-resize-observer";
import { MegafaceImageDescriptor } from "../../Part1Screen2/store/Part1Screen2Store";
import { Tinting, usePart3Store } from "../store/Part3Store";
import { ImageCard } from "./ImageCard";

export const PiledBoxes = memo(({ tinting }: { tinting: Tinting }) => {
  const size = useContext(ResponsiveContext);
  let isSmall = size === "small";
  const aspect = useScreenAspect();
  if (aspect < 1) {
    isSmall = true;
  }

  if (isSmall) {
    return <PiledBoxesHorizontal tinting={tinting} />;
  } else {
    return <PiledBoxesVertical tinting={tinting} />;
  }
});

const PiledBoxesVertical = memo(({ tinting }: { tinting: Tinting }) => {
  const ref = useRef<HTMLDivElement>(null);

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
      {fillArray.map((image, index) => (
        <Box
          flex={false}
          key={index}
          width="100%"
          height="100%"
          style={{ position: "relative", maxWidth: "30vw" }}
        >
          {image !== undefined && (
            <Box
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <ImageCard width={1} height={1} image={image}></ImageCard>
            </Box>
          )}
        </Box>
      ))}
    </Grid>
  );
});

PiledBoxesVertical.displayName = "PiledBoxesVertical";

const PiledBoxesHorizontal = memo(({ tinting }: { tinting: Tinting }) => {
  const ref = useRef<HTMLDivElement>(null);

  const images = usePart3Store((state) => state.images[tinting]);
  const { rowArray, fillArray } = useMemo(() => {
    const topPopFrom = [...images];
    const closestSquare = Math.max(Math.ceil(Math.sqrt(images.length)), 5);

    const rowArray = Array.from({ length: closestSquare }).map(() => "flex");

    const circularOrderFillArray: Array<number> = Array.from({
      length: rowArray.length ** 2,
    }).map((_, index) => index);

    circularOrderFillArray.sort(sortByDistance(closestSquare, closestSquare));

    const fillArray: Array<MegafaceImageDescriptor | undefined> = Array.from({
      length: rowArray.length ** 2,
    });

    circularOrderFillArray.forEach((index) => {
      fillArray[index] = topPopFrom.pop();
    });
    return { rowArray, fillArray };
  }, [images]);

  return (
    <Grid fill ref={ref} rows={rowArray} columns={rowArray}>
      {fillArray.map((image, index) => (
        <Box
          flex={false}
          key={index}
          width="100%"
          height="100%"
          style={{ position: "relative" }}
        >
          {image !== undefined && (
            <Box
              style={{
                position: "absolute",
                width: "100%",
                minWidth: "40px",
                minHeight: "28px",
                transform: "translate(-25%, 0)",
              }}
            >
              <ImageCard width={1} height={1} image={image}></ImageCard>
            </Box>
          )}
        </Box>
      ))}
    </Grid>
  );
});

PiledBoxesHorizontal.displayName = "PiledBoxesHorizontal";

function sortByDistance(width: number, height: number) {
  return (indexA: number, indexB: number) => {
    const yA = (getY(indexA, width) * 4) / 3;
    const yB = (getY(indexB, width) * 4) / 3;

    const xA = getX(indexA, width);
    const xB = getX(indexB, width);

    const distanceA = Math.hypot(xA - width / 2, yA - height / 2);
    const distanceB = Math.hypot(xB - width / 2, yB - height / 2);

    if (distanceA === distanceB) return -1;
    return distanceA - distanceB;
  };
}

const getX = (index: number, width: number) => {
  return index % width;
};

const getY = (index: number, width: number) => {
  return Math.floor(index / width);
};
