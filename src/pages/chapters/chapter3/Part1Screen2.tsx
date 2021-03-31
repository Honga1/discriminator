import { Box, Grid, Image, ResponsiveContext, Text } from "grommet";
import React, {
  memo,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import useResizeObserver from "use-resize-observer";

export interface Part1Screen2Props {
  stage:
    | 0
    | 1
    | 2
    | 3
    | 4
    | "ZOOMED_OUT"
    | "USER_CONTROL"
    | "NO_YEARS"
    | "2006"
    | "2007"
    | "2010"
    | "2011"
    | "2012"
    | "2013";
}

export const Part1Screen2Selector = ({ seconds }: { seconds: number }) => {
  let stage: Part1Screen2Props["stage"];

  // Start at the time above it, ends at the if statement.
  if (seconds < 38) {
    stage = "NO_YEARS";
  } else if (seconds < 42) {
    stage = "2011";
  } else if (seconds < 45) {
    stage = "2010";
  } else if (seconds < 48) {
    stage = "2007";
  } else if (seconds < 52) {
    stage = "2013";
  } else if (seconds < 54) {
    stage = "2006";
  } else if (seconds < 56) {
    stage = "2012";
  } else if (seconds < 57) {
    stage = "ZOOMED_OUT";
  } else if (seconds < 60) {
    //  I see you
    stage = 0;
  } else if (seconds < 61) {
    stage = "ZOOMED_OUT";
  } else if (seconds < 65) {
    // "A kid with a pumpkin" ZOOMIN 1
    stage = 1;
  } else if (seconds < 66) {
    stage = "ZOOMED_OUT";
  } else if (seconds < 70) {
    // "I see, looks like you" ZOOMIN 2
    stage = 2;
  } else if (seconds < 72) {
    stage = "ZOOMED_OUT";
  } else if (seconds < 76) {
    // "There's a woman" ZOOMIN 3
    stage = 3;
  } else if (seconds < 77) {
    stage = "ZOOMED_OUT";
  } else if (seconds < 93) {
    //  "There's you" ZOOMIN 4
    stage = 4;
  } else if (seconds < 94) {
    stage = "ZOOMED_OUT";
  } else {
    stage = "USER_CONTROL";
  }

  return <Part1Screen2 stage={stage} />;
};

const years = new Set([2006, 2007, 2010, 2011, 2012, 2013] as const);

const FadeInBox = styled(Box)<{ isShown: boolean }>`
  opacity: ${(props) => (props.isShown ? "1" : "0")};
  transition: opacity 1s;
`;
const SlideDownBox = styled(Box)<{ isShown: boolean }>`
  opacity: ${(props) => (props.isShown ? "1" : "0")};
  transition: opacity 1s, transform 1s;

  transform: ${({ isShown }) =>
    !isShown ? `translateY(-100%)` : "translateY(0)"};
`;
const SlideLeftBox = styled(Box)<{ isShown: boolean }>`
  opacity: ${(props) => (props.isShown ? "1" : "0")};
  transition: opacity 1s, transform 1s;

  transform: ${({ isShown }) =>
    !isShown ? `translateX(100%)` : "translateX(0)"};
`;

export const Part1Screen2 = memo(({ stage }: Part1Screen2Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);

  const isSmall = useContext(ResponsiveContext) === "small";

  const [target, setTarget] = useState<
    { x: number; y: number; target: HTMLElement } | undefined
  >(undefined);

  const isAnimating = useRef(false);

  const [yearsShown, setYearsShown] = useState<typeof years>(new Set());

  useEffect(() => {
    if (!ref.current) return;

    const container = ref.current;
    const onTransitionStart = () => {
      isAnimating.current = true;
    };
    container.addEventListener("transitionstart", onTransitionStart);
    const onTransitionEnd = () => {
      isAnimating.current = false;
    };
    container.addEventListener("transitionend", onTransitionEnd);
    return () => {
      container.removeEventListener("transitionstart", onTransitionStart);
      container.removeEventListener("transitionend", onTransitionEnd);
    };
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;
    if (typeof stage === "number") {
      const image = stage;
      const elements = ref.current.getElementsByClassName("auto-pickable");
      const choice = elements[image] as HTMLDivElement | undefined;
      if (!choice) {
        throw new Error(
          `Could not find image: ${image} from elements: ${elements}`
        );
      }
      const { translationX, translationY } = getTranslation(
        choice,
        container,
        scrollContainer
      );
      setTarget({
        x: -translationX,
        y: -translationY,
        target: choice,
      });
      choice.classList.add("is-picked");
      return;
    }

    switch (stage) {
      case "NO_YEARS":
        setYearsShown(new Set());
        break;
      case "2011":
        setYearsShown(new Set([2011]));
        break;
      case "2010":
        setYearsShown(new Set([2011, 2010]));
        break;
      case "2007":
        setYearsShown(new Set([2011, 2010, 2007]));
        break;
      case "2013":
        setYearsShown(new Set([2011, 2010, 2007, 2013]));
        break;
      case "2006":
        setYearsShown(new Set([2011, 2010, 2007, 2013, 2006]));
        break;
      case "2012":
        setYearsShown(new Set([2011, 2010, 2007, 2013, 2006, 2012]));
        break;
      default:
        setYearsShown(new Set([2011, 2010, 2007, 2013, 2006, 2012]));
    }

    if (typeof stage === "string" && stage !== "USER_CONTROL") {
      target?.target.classList.remove("is-picked");
      setTarget(undefined);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    if (!ref.current) return;
    if (stage !== "USER_CONTROL") return;
    const container = ref.current;
    const onClick = (event: MouseEvent): void => {
      if (isAnimating.current) return;
      const isZoomed = target !== undefined;
      if (isZoomed) {
        target?.target.classList.remove("is-picked");
        setTarget(undefined);
        return;
      }
      if ((event.target as HTMLElement).tagName !== "IMG") return;
      const choice = event.target as HTMLElement;
      const { translationX, translationY } = getTranslation(
        choice,
        container,
        scrollContainer
      );
      setTarget({
        x: -translationX,
        y: -translationY,
        target: choice,
      });
      choice.classList.add("is-picked");
    };
    container.addEventListener("click", onClick);
    return () => {
      container.removeEventListener("click", onClick);
    };
  }, [stage, target]);

  const {
    images2006,
    images2007,
    images2010,
    images2011,
    images2012,
    images2013,
  } = useImages();

  return isSmall ? (
    <Box
      flex={false}
      height="100%"
      width="100%"
      justify="center"
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
          pad={"16px"}
          areas={[
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
          ]}
          rows={[
            "flex",
            "flex",
            "flex",
            "flex",
            "flex",
            "flex",
            "flex",
            "flex",
          ]}
          columns={["auto", "flex"]}
          gap={"16px"}
        >
          <SlideLeftBox
            gridArea="stackedBoxes2006"
            align="center"
            isShown={yearsShown.has(2006)}
          >
            <StackedBoxesHorizontal images={images2006} />
          </SlideLeftBox>
          <SlideLeftBox
            gridArea="stackedBoxes2007"
            align="center"
            isShown={yearsShown.has(2007)}
          >
            <StackedBoxesHorizontal images={images2007} />
          </SlideLeftBox>
          <SlideLeftBox
            gridArea="stackedBoxes2010"
            align="center"
            isShown={yearsShown.has(2010)}
          >
            <StackedBoxesHorizontal images={images2010} />
          </SlideLeftBox>
          <SlideLeftBox
            gridArea="stackedBoxes2011"
            align="center"
            isShown={yearsShown.has(2011)}
          >
            <StackedBoxesHorizontal images={images2011} />
          </SlideLeftBox>
          <SlideLeftBox
            gridArea="stackedBoxes2012"
            align="center"
            isShown={yearsShown.has(2012)}
          >
            <StackedBoxesHorizontal images={images2012} />
          </SlideLeftBox>
          <SlideLeftBox
            gridArea="stackedBoxes2013"
            align="center"
            isShown={yearsShown.has(2013)}
          >
            <StackedBoxesHorizontal images={images2013} />
          </SlideLeftBox>
          <FadeInBox
            gridArea="text2006"
            align="center"
            isShown={yearsShown.has(2006)}
          >
            <Text size="24px" style={{ lineHeight: "72px" }} color="white">
              2006
            </Text>
          </FadeInBox>
          <FadeInBox
            gridArea="text2007"
            align="center"
            isShown={yearsShown.has(2007)}
          >
            <Text size="24px" style={{ lineHeight: "72px" }} color="white">
              2007
            </Text>
          </FadeInBox>
          <FadeInBox
            gridArea="text2010"
            align="center"
            isShown={yearsShown.has(2010)}
          >
            <Text size="24px" style={{ lineHeight: "72px" }} color="white">
              2010
            </Text>
          </FadeInBox>
          <FadeInBox
            gridArea="text2011"
            align="center"
            isShown={yearsShown.has(2011)}
          >
            <Text size="24px" style={{ lineHeight: "72px" }} color="white">
              2011
            </Text>
          </FadeInBox>
          <FadeInBox
            gridArea="text2012"
            align="center"
            isShown={yearsShown.has(2012)}
          >
            <Text size="24px" style={{ lineHeight: "72px" }} color="white">
              2012
            </Text>
          </FadeInBox>
          <FadeInBox
            gridArea="text2013"
            align="center"
            isShown={yearsShown.has(2013)}
          >
            <Text size="24px" style={{ lineHeight: "72px" }} color="white">
              2013
            </Text>
          </FadeInBox>
        </Grid>
      </AnimateEverything>
    </Box>
  ) : (
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
          pad={"48px"}
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
          <SlideDownBox
            gridArea="stackedBoxes2006"
            align="center"
            isShown={yearsShown.has(2006)}
          >
            <StackedBoxes images={images2006} />
          </SlideDownBox>
          <SlideDownBox
            gridArea="stackedBoxes2007"
            align="center"
            isShown={yearsShown.has(2007)}
          >
            <StackedBoxes images={images2007} />
          </SlideDownBox>
          <SlideDownBox
            gridArea="stackedBoxes2010"
            align="center"
            isShown={yearsShown.has(2010)}
          >
            <StackedBoxes images={images2010} />
          </SlideDownBox>
          <SlideDownBox
            gridArea="stackedBoxes2011"
            align="center"
            isShown={yearsShown.has(2011)}
          >
            <StackedBoxes images={images2011} />
          </SlideDownBox>
          <SlideDownBox
            gridArea="stackedBoxes2012"
            align="center"
            isShown={yearsShown.has(2012)}
          >
            <StackedBoxes images={images2012} />
          </SlideDownBox>
          <SlideDownBox
            gridArea="stackedBoxes2013"
            align="center"
            isShown={yearsShown.has(2013)}
          >
            <StackedBoxes images={images2013} />
          </SlideDownBox>
          <FadeInBox
            gridArea="text2006"
            align="center"
            isShown={yearsShown.has(2006)}
          >
            <Text size="24px" style={{ lineHeight: "72px" }} color="white">
              2006
            </Text>
          </FadeInBox>
          <FadeInBox
            gridArea="text2007"
            align="center"
            isShown={yearsShown.has(2007)}
          >
            <Text size="24px" style={{ lineHeight: "72px" }} color="white">
              2007
            </Text>
          </FadeInBox>
          <FadeInBox
            gridArea="text2010"
            align="center"
            isShown={yearsShown.has(2010)}
          >
            <Text size="24px" style={{ lineHeight: "72px" }} color="white">
              2010
            </Text>
          </FadeInBox>
          <FadeInBox
            gridArea="text2011"
            align="center"
            isShown={yearsShown.has(2011)}
          >
            <Text size="24px" style={{ lineHeight: "72px" }} color="white">
              2011
            </Text>
          </FadeInBox>
          <FadeInBox
            gridArea="text2012"
            align="center"
            isShown={yearsShown.has(2012)}
          >
            <Text size="24px" style={{ lineHeight: "72px" }} color="white">
              2012
            </Text>
          </FadeInBox>
          <FadeInBox
            gridArea="text2013"
            align="center"
            isShown={yearsShown.has(2013)}
          >
            <Text size="24px" style={{ lineHeight: "72px" }} color="white">
              2013
            </Text>
          </FadeInBox>
        </Grid>
      </AnimateEverything>
    </Box>
  );
});

const RevealableImage = styled(Image)<{ isShown?: boolean }>`
  width: 100%;
  object-fit: cover;
  height: 100%;
  transition: opacity 1s;
  opacity: ${(props) => (props.isShown ? 1 : 0)};
  backface-visibility: hidden;
  /* transform: scale(1) translateZ(0); */

  &.auto-pickable {
  }

  &.is-picked {
    opacity: 1;
  }
`;

const zoomFactor = 3;
const AnimateEverything = styled(Box)<{
  target?: { x: number; y: number };
}>`
  backface-visibility: hidden;
  transition: transform 1s ease-in-out;
  transform: ${(props) =>
    !props.target
      ? `translateZ(0) scale(1)`
      : `scale(${zoomFactor}) translate(${props.target.x}px, ${props.target.y}px)`};
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

const StackedBoxesHorizontal = ({ images }: { images: ReactElement[] }) => {
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

    const rowHeight = (maxWidth * desiredAspect * width) / (height / rowCount);
    const maxHeight = 1;

    const isRowTooHigh = maxHeight <= rowHeight;

    if (isRowTooHigh) {
      const reducedWidth =
        ((maxHeight / desiredAspect) * height) / width / rowCount;

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
    image: ReactElement;
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
          {image}
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

function getTranslation(
  choice: HTMLElement,
  container: HTMLDivElement,
  scrollContainer: React.RefObject<HTMLDivElement>
) {
  const elementBoundingBox = choice.getBoundingClientRect();
  const parentBoundingBox = container.getBoundingClientRect();
  const scrollLeft = scrollContainer.current?.scrollLeft ?? 0;
  const scrollTop = scrollContainer.current?.scrollTop ?? 0;
  const elementCenterX = elementBoundingBox.x + elementBoundingBox.width / 2;
  const elementCenterY = elementBoundingBox.y + elementBoundingBox.height / 2;
  const screenCenterX = parentBoundingBox.x + parentBoundingBox.width / 2;
  const screenCenterY = parentBoundingBox.y + parentBoundingBox.height / 2;
  const translationX = elementCenterX - screenCenterX - scrollLeft / zoomFactor;
  const translationY = elementCenterY - screenCenterY - scrollTop / zoomFactor;
  return { translationX, translationY };
}

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
