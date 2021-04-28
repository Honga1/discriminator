import { useSpring } from "@react-spring/core";
import { Box, Image, ResponsiveContext } from "grommet";
import React, {
  memo,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { animated } from "react-spring";
import styled from "styled-components";
import useResizeObserver from "use-resize-observer";
import { useImages } from "./useImages";

export const StackedBoxes = memo(
  ({
    year,
    tinting,
    isShown,
  }: {
    year: 2011 | 2010 | 2007 | 2013 | 2006 | 2012;
    tinting: { wedding: boolean; family: boolean; party: boolean };
    isShown: boolean;
  }) => {
    const isSmall = useContext(ResponsiveContext) === "small";
    const images = useImages()[year];

    if (isSmall) {
      return (
        <StackedBoxesHorizontal
          images={images}
          tinting={tinting}
          isShown={isShown}
        />
      );
    } else {
      return (
        <StackedBoxesVertical
          images={images}
          tinting={tinting}
          isShown={isShown}
        />
      );
    }
  }
);

const StackedBoxesVertical = ({
  images,
  tinting,
  isShown,
}: {
  images: {
    image_url: string;
    path_alias: string;
    nsid: string;
    photo_id: number;
    license: string;
    date: string;
    tagged: "wedding" | "family" | "party";
  }[];
  tinting: { wedding: boolean; family: boolean; party: boolean };
  isShown: boolean;
}) => {
  const amount = images.length;
  const [[boxWidth, boxHeight], setDimensions] = useState([1, 1 / 8]);
  const cellsPerColumn = 8;

  const columnCount = Math.ceil(amount / cellsPerColumn);

  const ref = useRef<HTMLDivElement>(null);
  const { width = 1, height = 1 } = useResizeObserver<HTMLDivElement>({
    ref,
  });

  const { BoxesLeft, BoxesRight } = useBoxes(amount, cellsPerColumn);

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
            <BoxesLeft
              boxHeight={boxHeight}
              boxWidth={boxWidth}
              images={images}
              tinting={tinting}
              isShown={isShown}
            />
          </Box>
          {columnCount === 2 && (
            <Box
              direction="column"
              height="100%"
              width="100%"
              align="center"
              justify="end"
            >
              <BoxesRight
                boxHeight={boxHeight}
                boxWidth={boxWidth}
                images={images}
                tinting={tinting}
                isShown={isShown}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const StackedBoxesHorizontal = ({
  images,
  tinting,
  isShown,
}: {
  images: {
    image_url: string;
    path_alias: string;
    nsid: string;
    photo_id: number;
    license: string;
    date: string;
    tagged: "family" | "party" | "wedding";
  }[];
  tinting: { wedding: boolean; family: boolean; party: boolean };
  isShown: boolean;
}) => {
  const amount = images.length;
  const [[boxWidth, boxHeight], setDimensions] = useState([1, 1 / 8]);
  const cellsPerRow = 8;

  const rowCount = Math.ceil(amount / cellsPerRow);

  const ref = useRef<HTMLDivElement>(null);
  const { width = 1, height = 1 } = useResizeObserver<HTMLDivElement>({
    ref,
  });

  const { BoxesLeft: BoxesUp, BoxesRight: BoxesDown } = useBoxes(
    amount,
    cellsPerRow
  );

  useLayoutEffect(() => {
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
            <BoxesUp
              boxHeight={boxHeight}
              boxWidth={boxWidth}
              images={images}
              tinting={tinting}
              isShown={isShown}
            />
          </Box>
          {rowCount === 2 && (
            <Box
              direction="row"
              height="100%"
              width="100%"
              align="center"
              justify="start"
            >
              <BoxesDown
                boxHeight={boxHeight}
                boxWidth={boxWidth}
                images={images}
                tinting={tinting}
                isShown={isShown}
              />
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
    isTinted,
    isShown,
  }: {
    isTinted: boolean;
    width: number;
    height: number;
    image: {
      image_url: string;
      path_alias: string;
      nsid: string;
      photo_id: number;
      license: string;
      date: string;
      tagged: string;
    };
    isShown: boolean;
  }) => {
    const targetRotation = useRef(Math.random() * 84 - 42);
    const startRotation = useRef(
      targetRotation.current + (Math.random() - 0.5) * 10
    );
    const startOffset = useRef(Math.random() * 50);
    const isSmall = useContext(ResponsiveContext) === "small";

    const [{ transform, opacity }] = useSpring(() => {
      const slideDirection = isSmall ? "LEFT" : "DOWN";
      const translation =
        slideDirection === "LEFT"
          ? `translate(${startOffset.current}%, 0%)`
          : `translate(0, -${startOffset.current}%)`;

      return {
        transform: !isShown
          ? `${translation} rotate(${startRotation.current}deg)`
          : `translate(0%, 0%) rotate(${targetRotation.current}deg)`,
        opacity: !isShown ? 0 : 1,
      };
    }, [isShown]);

    return (
      <AnimatedBox
        flex={false}
        width={width * 100 + "%"}
        height={height * 100 + "%"}
        style={{ position: "relative", opacity: opacity }}
      >
        <AnimatedBox
          style={{
            top: 1,
            left: 1,
            right: 1,
            bottom: 1,
            position: "absolute",
            transform: transform,
            backfaceVisibility: "hidden",
            zIndex: -1,
          }}
          background="#502B2D"
          border={{ color: "#FF4E4E", size: " 2px" }}
        />

        <AnimatedBox
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "absolute",
            transform,
            overflow: "hidden",
          }}
        >
          <RevealableImage
            style={{ willChange: "opacity" }}
            src={image.image_url}
            className="auto-pickable"
            draggable={false}
          />
        </AnimatedBox>

        <TintedDiv
          className={isTinted ? `tint-${image.tagged}` : ""}
          style={{ transform: transform }}
        />
      </AnimatedBox>
    );
  }
);
const AnimatedBox = animated(Box);

const TintedDiv = animated(styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transition: background-color 1s linear;
  pointer-events: none;
  backface-visibility: hidden;
  will-change: background-color;

  &.tint-wedding {
    background-color: rgba(255, 89, 89, 0.4);
  }

  &.tint-party {
    background-color: rgba(117, 122, 255, 0.4);
  }

  &.tint-family {
    background-color: rgba(32, 191, 0, 0.4);
  }
`);

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

function useBoxes(amount: number, cellsPerColumn: number) {
  const leftArray = useRef([...new Array(Math.min(amount, cellsPerColumn))]);
  const rightArray = useRef([
    ...new Array(Math.max(amount - Math.min(amount, cellsPerColumn), 0)),
  ]);

  const BoxesLeft = useCallback(
    ({
      boxWidth,
      boxHeight,
      images,
      tinting,
      isShown,
    }: {
      boxWidth: number;
      boxHeight: number;
      images: {
        image_url: string;
        path_alias: string;
        nsid: string;
        photo_id: number;
        license: string;
        date: string;
        tagged: "wedding" | "family" | "party";
      }[];
      tinting: { wedding: boolean; family: boolean; party: boolean };
      isShown: boolean;
    }) => (
      <>
        {leftArray.current.map((_, index) => {
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
              isTinted={tinting[image.tagged]}
              isShown={isShown}
            />
          );
        })}
      </>
    ),
    []
  );
  const BoxesRight = useCallback(
    ({
      boxWidth,
      boxHeight,
      images,
      tinting,
      isShown,
    }: {
      boxWidth: number;
      boxHeight: number;
      images: {
        image_url: string;
        path_alias: string;
        nsid: string;
        photo_id: number;
        license: string;
        date: string;
        tagged: "wedding" | "family" | "party";
      }[];
      tinting: { wedding: boolean; family: boolean; party: boolean };
      isShown: boolean;
    }) => (
      <>
        {rightArray.current.map((_, index) => {
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
              isTinted={tinting[image.tagged]}
              isShown={isShown}
            />
          );
        })}
      </>
    ),
    []
  );

  return { BoxesLeft, BoxesRight };
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
