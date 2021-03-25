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

export interface Part3Screen1Props {
  stage: "NO_TINTING" | "WEDDING" | "PARTY" | "FAMILY" | "USER_CONTROL";
}

const stageProgress = [
  "NO_TINTING",
  "WEDDING",
  "PARTY",
  "FAMILY",
  "USER_CONTROL",
] as const;

function stageIsAfter(
  stage: Part3Screen1Props["stage"],
  point: Part3Screen1Props["stage"]
) {
  const stageIndex = stageProgress.findIndex((test) => test === stage);
  const pointIndex = stageProgress.findIndex((test) => test === point);

  return stageIndex > pointIndex;
}

export const Part3Screen1Selector = ({ seconds }: { seconds: number }) => {
  let stage: Part3Screen1Props["stage"];

  if (seconds < 200) {
    stage = "NO_TINTING";
  } else if (seconds < 204) {
    stage = "WEDDING";
  } else if (seconds < 208) {
    stage = "PARTY";
  } else if (seconds < 230) {
    stage = "FAMILY";
  } else {
    stage = "FAMILY";
  }

  return <Part3Screen1 stage={stage} />;
};

export const Part3Screen1 = memo(({ stage }: Part3Screen1Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);

  const isSmall = useContext(ResponsiveContext) === "small";

  const [target, setTarget] = useState<
    { x: number; y: number; target: HTMLElement } | undefined
  >(undefined);

  const isAnimating = useRef(false);

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
    const tintableElements = container.querySelectorAll(".tint");

    tintableElements.forEach((element) => {
      const currentStageIndex = stageProgress.findIndex(
        (test) => test === stage
      );

      const stagesBelow = stageProgress.slice(0, currentStageIndex + 1);
      const stagesAbove = stageProgress.slice(
        currentStageIndex + 1,
        stageProgress.length
      );

      stagesBelow.forEach((stage) => {
        if (element.classList.contains(`type-${stage}`)) {
          (element as HTMLDivElement).style.opacity = "1";
        }
      });

      stagesAbove.forEach((stage) => {
        if (element.classList.contains(`type-${stage}`)) {
          (element as HTMLDivElement).style.opacity = "0";
        }
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;

    const onClick = (event: MouseEvent): void => {
      if (isAnimating.current) return;
      const isZoomed = target !== undefined;

      if (isZoomed) {
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
      style={{
        position: `relative`,
        overflow: "auto",
      }}
      ref={scrollContainer}
    >
      <AnimateTransform
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "visible",
        }}
        target={target}
        ref={ref}
        gap="24px"
        pad="16px"
      >
        <YearLabelSmall year={2006} />
        <StackedBoxesHorizontal
          className={"stacked-boxes year2006"}
          images={images2006}
        />
        <YearLabelSmall year={2007} />
        <StackedBoxesHorizontal
          className={"stacked-boxes year2007"}
          images={images2007}
        />
        <YearLabelSmall year={2010} />
        <StackedBoxesHorizontal
          className={"stacked-boxes year2010"}
          images={images2010}
        />
        <YearLabelSmall year={2011} />
        <StackedBoxesHorizontal
          className={"stacked-boxes year2011"}
          images={images2011}
        />
        <YearLabelSmall year={2012} />
        <StackedBoxesHorizontal
          className={"stacked-boxes year2012"}
          images={images2012}
        />
        <YearLabelSmall year={2013} />
        <StackedBoxesHorizontal
          className={"stacked-boxes year2013"}
          images={images2013}
        />
      </AnimateTransform>
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
      <AnimateTransform
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
        <CategoryLabels stage={stage} />
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
            <StackedBoxes
              className={"stacked-boxes year2006"}
              images={images2006}
            />
          </Box>
          <Box gridArea="stackedBoxes2007" align="center">
            <StackedBoxes
              className={"stacked-boxes year2007"}
              images={images2007}
            />
          </Box>
          <Box gridArea="stackedBoxes2010" align="center">
            <StackedBoxes
              className={"stacked-boxes year2010"}
              images={images2010}
            />
          </Box>
          <Box gridArea="stackedBoxes2011" align="center">
            <StackedBoxes
              className={"stacked-boxes year2011"}
              images={images2011}
            />
          </Box>
          <Box gridArea="stackedBoxes2012" align="center">
            <StackedBoxes
              className={"stacked-boxes year2012"}
              images={images2012}
            />
          </Box>
          <Box gridArea="stackedBoxes2013" align="center">
            <StackedBoxes
              className={"stacked-boxes year2013"}
              images={images2013}
            />
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
      </AnimateTransform>
    </Box>
  );
});

function YearLabelSmall({ year }: { year: number }) {
  return (
    <Box flex={false}>
      <Text
        size="20px"
        style={{
          lineHeight: "30px",
        }}
        color="white"
      >
        {year}
      </Text>
    </Box>
  );
}

function CategoryLabels(props: { stage: Part3Screen1Props["stage"] }) {
  return (
    <Box
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <Box
        style={{
          position: "absolute",
          width: "200px",
          top: "21px",
          left: "32px",
        }}
      >
        <Text
          size="48px"
          style={{
            lineHeight: "48px",
            opacity: stageIsAfter(props.stage, "NO_TINTING") ? 1 : 0,
            transition: "opacity 1s",
          }}
          color={"redLight"}
        >
          Wedding
        </Text>
        <Text
          size="48px"
          style={{
            lineHeight: "48px",
            opacity: stageIsAfter(props.stage, "WEDDING") ? 1 : 0,
            transition: "opacity 1s",
          }}
          color="blueLight"
        >
          Party
        </Text>
        <Text
          size="48px"
          style={{
            lineHeight: "48px",
            opacity: stageIsAfter(props.stage, "PARTY") ? 1 : 0,
            transition: "opacity 1s",
          }}
          color="greenLight"
        >
          Family & Friends
        </Text>
      </Box>
    </Box>
  );
}

const TintableImage = ({
  type,
  src,
}: {
  type: "WEDDING" | "PARTY" | "FAMILY";
  src: string;
}) => {
  let color;
  switch (type) {
    case "WEDDING":
      color = "rgba(255, 89, 89, 0.4)";
      break;
    case "PARTY":
      color = "rgba(117, 122, 255, 0.4)";
      break;
    case "FAMILY":
      color = "rgba(32, 191, 0, 0.4)";
      break;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        className={`tint type-${type}`}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: color,
          transition: "opacity 1s linear",
          pointerEvents: "none",
          backfaceVisibility: "hidden",
        }}
      ></div>

      <Image
        fit="cover"
        width="100%"
        height="100%"
        style={{ backfaceVisibility: "hidden" }}
        src={src}
      />
    </div>
  );
};

const zoomFactor = 3;
const AnimateTransform = styled(Box)<{
  target?: { x: number; y: number };
}>`
  backface-visibility: hidden;
  transition: transform 1s ease-in-out;
  transform: ${(props) =>
    !props.target
      ? `translateZ(0) scale(1)`
      : `scale(${zoomFactor}) translate(${props.target.x}px, ${props.target.y}px)`};
`;

const StackedBoxes = ({
  className,
  images,
}: {
  images: ReactElement[];
  className: string;
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
      className={className}
      width="100%"
      height="100%"
      align="end"
      pad={{ horizontal: (columnCount - 1) * 16 + "px" }}
      style={{ transition: "opacity 0.2s linear" }}
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
  className,
}: {
  images: ReactElement[];
  className: string;
}) => {
  const [[boxWidth, boxHeight], setDimensions] = useState([1, 1 / 8]);

  const ref = useRef<HTMLDivElement>(null);
  const { width = 1, height = 1 } = useResizeObserver<HTMLDivElement>({
    ref,
  });

  const boxes = useMemo(
    () =>
      images.map((image, index) => {
        return (
          <AbsoluteRotatedBox
            width={boxWidth + "px"}
            height={boxHeight + "px"}
            key={index}
            image={image}
          />
        );
      }),
    [boxHeight, boxWidth, images]
  );
  useEffect(() => {
    if (!ref.current) return;
    const maxHeight = 0.71 * height;
    const desiredAspect = 4 / 3;
    const boxWidth = desiredAspect * maxHeight;

    setDimensions([boxWidth, maxHeight]);
  }, [height, ref, width]);

  return (
    <Box
      className={className}
      margin={{ left: "8px" }}
      ref={ref}
      flex={false}
      responsive={false}
      height="100px"
      direction="row"
      style={{ transition: "opacity 0.2s linear" }}
    >
      {boxes}
      <Box flex={false} width="32px"></Box>
    </Box>
  );
};

const HoverBox = styled(Box)<{ rotation: number }>`
  transform: scale(1) rotate(${({ rotation }) => rotation}deg);
  transition: transform 0.2s linear;
  &:hover {
    z-index: 1;
    transform: scale(1.05) rotate(${({ rotation }) => rotation}deg);
  }
`;

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
    const rotation = Math.random() * 84 - 42;
    return (
      <HoverBox
        className="rotated-box"
        flex={false}
        width={width * 100 + "%"}
        height={height * 100 + "%"}
        rotation={rotation}
      >
        {image}
      </HoverBox>
    );
  }
);
const AbsoluteRotatedBox = memo(
  ({
    width,
    height,
    image,
  }: {
    width: string;
    height: string;
    image: ReactElement;
  }) => {
    const rotation = Math.random() * 84 - 42;
    return (
      <HoverBox
        className="rotated-box"
        flex={false}
        width={width}
        height={height}
        rotation={rotation}
      >
        {image}
      </HoverBox>
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
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"PARTY"} />,
    ];
    const images2007 = [
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"FAMILY"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
    ];
    const images2010 = [
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"FAMILY"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"PARTY"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"PARTY"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"FAMILY"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
    ];
    const images2011 = [
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"FAMILY"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"PARTY"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"PARTY"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"FAMILY"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
    ];
    const images2012 = [
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
    ];
    const images2013 = [
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"FAMILY"} />,
      <TintableImage src="https://picsum.photos/100/100" type={"WEDDING"} />,
      <TintableImage src="https://picsum.photos/200/300" type={"WEDDING"} />,
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
