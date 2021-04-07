import { Box, Image, ResponsiveContext } from "grommet";
import React, {
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import useResizeObserver from "use-resize-observer";

export const StackedBoxes = ({
  images,
}: {
  images: {
    image_url: string;
    path_alias: string;
    nsid: string;
    photo_id: number;
    license: string;
    date: string;
  }[];
}) => {
  const isSmall = useContext(ResponsiveContext) === "small";

  if (isSmall) {
    return <StackedBoxesHorizontal images={images}></StackedBoxesHorizontal>;
  } else {
    return <StackedBoxesVertical images={images}></StackedBoxesVertical>;
  }
};

const StackedBoxesVertical = ({
  images,
}: {
  images: {
    image_url: string;
    path_alias: string;
    nsid: string;
    photo_id: number;
    license: string;
    date: string;
  }[];
}) => {
  const amount = images.length;
  const [[boxWidth, boxHeight], setDimensions] = useState([1, 1 / 8]);
  const cellsPerColumn = 8;

  const columnCount = Math.ceil(amount / cellsPerColumn);

  const ref = useRef<HTMLDivElement>(null);
  const { width = 1, height = 1 } = useResizeObserver<HTMLDivElement>({
    ref,
  });

  const { boxesLeft, boxesRight } = useBoxes(
    amount,
    cellsPerColumn,
    images,
    boxWidth,
    boxHeight
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
};

const StackedBoxesHorizontal = ({
  images,
}: {
  images: {
    image_url: string;
    path_alias: string;
    nsid: string;
    photo_id: number;
    license: string;
    date: string;
  }[];
}) => {
  const amount = images.length;
  const [[boxWidth, boxHeight], setDimensions] = useState([1, 1 / 8]);
  const cellsPerRow = 8;

  const rowCount = Math.ceil(amount / cellsPerRow);

  const ref = useRef<HTMLDivElement>(null);
  const { width = 1, height = 1 } = useResizeObserver<HTMLDivElement>({
    ref,
  });

  const { boxesLeft: boxesUp, boxesRight: boxesDown } = useBoxes(
    amount,
    cellsPerRow,
    images,
    boxWidth,
    boxHeight
  );

  useEffect(() => {
    if (!ref.current) return;
    const maxWidth = 1 / cellsPerRow;
    const desiredAspect = 4 / 3;

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
            {boxesUp}
          </Box>
          {rowCount === 2 && (
            <Box
              direction="row"
              height="100%"
              width="100%"
              align="center"
              justify="start"
            >
              {boxesDown}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const RelativeRotatedBox = memo(
  ({
    width,
    height,
    image,
  }: {
    width: number;
    height: number;
    image: {
      image_url: string;
      path_alias: string;
      nsid: string;
      photo_id: number;
      license: string;
      date: string;
    };
  }) => {
    const rotation = `rotate(${Math.random() * 84 - 42}deg)`;
    return (
      <Box
        className="rotated-box"
        flex={false}
        width={width * 100 + "%"}
        height={height * 100 + "%"}
        style={{ position: "relative" }}
      >
        <Box
          style={{
            top: 1,
            left: 1,
            right: 1,
            bottom: 1,
            position: "absolute",
            transform: rotation,
            backfaceVisibility: "hidden",
            zIndex: -1,
          }}
          border={{ color: "#FF4E4E", size: " 2px" }}
          background="#502B2D"
        ></Box>
        <Box
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "absolute",
            transform: rotation,
            overflow: "hidden",
          }}
        >
          <RevealableImage
            style={{ willChange: "opacity" }}
            src={image.image_url}
            className="auto-pickable"
            draggable={false}
          />
        </Box>
      </Box>
    );
  }
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
function useBoxes(
  amount: number,
  cellsPerColumn: number,
  images: {
    image_url: string;
    path_alias: string;
    nsid: string;
    photo_id: number;
    license: string;
    date: string;
  }[],
  boxWidth: number,
  boxHeight: number
) {
  const result = useMemo(() => {
    const boxesLeft = [...new Array(Math.min(amount, cellsPerColumn))].map(
      (_, index) => {
        const image = images[index];
        if (!image) {
          throw new Error(
            `Could not get image with index ${index} from ${images}`
          );
        }
        return (
          <RelativeRotatedBox
            width={boxWidth}
            height={boxHeight}
            key={index}
            image={image}
          />
        );
      }
    );

    const boxesRight = [
      ...new Array(Math.max(amount - Math.min(amount, cellsPerColumn), 0)),
    ].map((_, index) => {
      const image = images?.[index];
      if (!image) {
        throw new Error(
          `Could not get image with index ${index} from ${images}`
        );
      }
      return (
        <RelativeRotatedBox
          width={boxWidth}
          height={boxHeight}
          key={index}
          image={image}
        />
      );
    });
    return { boxesLeft, boxesRight };
  }, [amount, boxHeight, boxWidth, cellsPerColumn, images]);

  return result;
}

const RevealableImage = styled(Image)`
  width: 100%;
  object-fit: cover;
  height: 100%;
  transition: opacity 1s;
  opacity: 0;
  backface-visibility: hidden;
  user-select: none;
  touch-action: none;

  &.auto-pickable {
  }

  &.is-picked {
    opacity: 1;
  }
`;
