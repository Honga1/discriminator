import { Box, Grid, Image, ResponsiveContext, Text } from "grommet";
import React, {
  memo,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import useResizeObserver from "use-resize-observer";
import { useTimer } from "../../../hooks/useTimer";

export const Part1Screen2 = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const isSmall = useContext(ResponsiveContext) === "small";

  useTimer({
    loopAt: 10,
    onTick: useCallback((second, reset) => {
      switch (second) {
        case 0:
          setState("IDLE");
          break;
        case 1:
          setState("ZOOMING_IN");
          break;

        case 2:
          setState("ZOOMED_IN");
          break;

        case 7:
          setState("ZOOMING_OUT");
          break;

        case 8:
          setState("IDLE");
          break;
      }
    }, []),
  });
  const [state, setState] = useState<
    "IDLE" | "ZOOMING_IN" | "ZOOMED_IN" | "ZOOMING_OUT"
  >("IDLE");

  const [target, setTarget] = useState<
    { x: number; y: number; target: HTMLElement } | undefined
  >(undefined);

  useEffect(() => {
    if (!ref.current) return;

    switch (state) {
      case "ZOOMING_IN":
        const elements = ref.current.getElementsByClassName("auto-pickable");
        const choice = elements[Math.floor(Math.random() * elements.length)] as
          | HTMLDivElement
          | undefined;
        if (!choice) return;
        const position = choice.getBoundingClientRect();
        const parentPosition = ref.current.getBoundingClientRect();
        const translationX =
          position.x +
          position.width / 2 -
          (parentPosition.x + parentPosition.width / 2);
        const translationY =
          position.y +
          position.height / 2 -
          (parentPosition.y + parentPosition.height / 2);
        setTarget({
          x: -translationX,
          y: -translationY,
          target: choice,
        });
        choice.classList.add("is-picked");
        break;

      case "ZOOMING_OUT":
        target?.target.classList.remove("is-picked");
        setTarget(undefined);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const {
    images2006,
    images2007,
    images2010,
    images2011,
    images2012,
    images2013,
  } = useImages();

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
        target={target}
        ref={ref}
      >
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
          columns={[
            "flex",
            "flex",
            "flex",
            "flex",
            "flex",
            "flex",
            "flex",
            "flex",
          ]}
          rows={["flex", "auto"]}
          gap={"16px"}
        >
          <Box gridArea="stackedBoxes2006" align="center">
            <StackedBoxes images={images2006} />
          </Box>
          <Box gridArea="stackedBoxes2007" align="center">
            <StackedBoxes images={images2007} />
          </Box>
          <Box gridArea="stackedBoxes2010" align="center">
            <StackedBoxes images={images2010} />
          </Box>
          <Box gridArea="stackedBoxes2011" align="center">
            <StackedBoxes images={images2011} />
          </Box>
          <Box gridArea="stackedBoxes2012" align="center">
            <StackedBoxes images={images2012} />
          </Box>
          <Box gridArea="stackedBoxes2013" align="center">
            <StackedBoxes images={images2013} />
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
      </AnimateEverything>
    </Box>
  );
});

const RevealableImage = styled(Image)<{ isShown?: boolean }>`
  width: 100%;
  object-fit: "cover";
  height: 100%;
  transition: opacity 1s;
  opacity: ${(props) => (props.isShown ? 1 : 0)};

  &.auto-pickable {
  }

  &.is-picked {
    opacity: 1;
  }

  :hover {
    opacity: 1;
  }
`;

const AnimateEverything = styled(Box)<{
  target?: { x: number; y: number };
}>`
  transition: all 1s ease-out;
  transform: ${(props) =>
    !props.target
      ? `matrix(1, 0, 0, 1, 0, 0)`
      : `scale(2) translate(${props.target.x}px, ${props.target.y}px)`};
`;

const StackedBoxes = ({ images }: { images: ReactElement[] }) => {
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

const RotatedBox = memo(
  ({
    width,
    height,
    image,
  }: {
    width: number;
    height: number;
    image: ReactElement;
  }) => (
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
      >
        {image}
      </Box>
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

function useBoxes(
  amount: number,
  cellsPerColumn: number,
  images: ReactElement[],
  boxWidth: number,
  boxHeight: number
) {
  const result = useMemo(() => {
    const boxesLeft = [...new Array(Math.min(amount, cellsPerColumn))].map(
      (_, index) => {
        const image = images?.[index];
        return (
          <RotatedBox
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

      return (
        <RotatedBox
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

function useImages() {
  return useMemo(() => {
    const images2006 = [
      <RevealableImage
        className="auto-pickable"
        src="https://picsum.photos/200/300"
      />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
    ];
    const images2007 = [
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage
        className="auto-pickable"
        src="https://picsum.photos/200/300"
      />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
    ];
    const images2010 = [
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage
        className="auto-pickable"
        src="https://picsum.photos/200/300"
      />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
    ];
    const images2011 = [
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage
        className="auto-pickable"
        src="https://picsum.photos/200/300"
      />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
    ];
    const images2012 = [
      <RevealableImage src="https://picsum.photos/200/300" />,
    ];
    const images2013 = [
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage
        className="auto-pickable"
        src="https://picsum.photos/200/300"
      />,
      <RevealableImage src="https://picsum.photos/100/100" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
    ];
    return {
      images2006,
      images2007,
      images2010,
      images2011,
      images2012,
      images2013,
    };
  }, []);
}
