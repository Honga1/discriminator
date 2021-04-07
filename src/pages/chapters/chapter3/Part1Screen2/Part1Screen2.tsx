import { Box, Grid, ResponsiveContext, Text } from "grommet";
import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { animated, to, useSpring } from "react-spring";
import { useGesture } from "react-use-gesture";
import styled from "styled-components";
import { StackedBoxes } from "./StackedBoxes";
import { useImages } from "./useImages";

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

interface Part1Screen2Props {
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

const Part1Screen2 = memo(({ stage }: Part1Screen2Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);

  const isSmall = useContext(ResponsiveContext) === "small";

  const [target, setTarget] = useState<
    { x: number; y: number; target: HTMLElement } | undefined
  >(undefined);

  const [yearsShown, setYearsShown] = useState(
    new Set<typeof yearsInShownOrder[number]>()
  );

  // Handles hiding / showing whole columns
  useEffect(() => {
    if (
      typeof stage === "number" ||
      stage === "ZOOMED_OUT" ||
      stage === "USER_CONTROL"
    ) {
      setYearsShown(new Set(yearsInShownOrder));
      return;
    }

    if (stage === "NO_YEARS") {
      setYearsShown(new Set());
      return;
    }

    const index = yearsInShownOrder.findIndex(
      (year) => year === parseInt(stage, 10)
    );
    const shown = yearsInShownOrder.slice(0, index + 1);
    setYearsShown(new Set(shown));
  }, [stage]);

  // Handles automated movement
  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;

    if (typeof stage !== "number") {
      target?.target.classList.remove("is-picked");
      setTarget(undefined);
      return;
    }

    const image = stage;
    const elements = container.getElementsByClassName("auto-pickable");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Handles user movement
  // const isAnimating = useIsCSSAnimating(ref);
  // useEffect(() => {
  //   if (!ref.current) return;
  //   if (stage !== "USER_CONTROL") return;
  //   const container = ref.current;
  //   const onClick = (event: MouseEvent): void => {
  //     if (isAnimating.current) return;
  //     const isZoomed = target !== undefined;
  //     if (isZoomed) {
  //       target?.target.classList.remove("is-picked");
  //       setTarget(undefined);
  //       return;
  //     }
  //     if ((event.target as HTMLElement).tagName !== "IMG") return;
  //     const choice = event.target as HTMLElement;
  //     const { translationX, translationY } = getTranslation(
  //       choice,
  //       container,
  //       scrollContainer
  //     );
  //     setTarget({
  //       x: -translationX,
  //       y: -translationY,
  //       target: choice,
  //     });
  //     choice.classList.add("is-picked");
  //   };
  //   container.addEventListener("click", onClick);
  //   return () => {
  //     container.removeEventListener("click", onClick);
  //   };
  // }, [isAnimating, stage, target]);

  const [{ x, y, scale }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    drag: false,
  }));
  const bind = useGesture({
    onDrag: ({ delta: [deltaX, deltaY], event, pinching }) => {
      event.preventDefault();

      !pinching &&
        set({
          x: x.goal + deltaX / scale.goal,
          y: y.goal + deltaY / scale.goal,
        });
    },

    onWheel: ({ delta: [, distance], event: { clientX, clientY, target } }) => {
      const nextScale = clamp(
        (scale?.goal ?? 1) * 1.1 ** (-distance / 52),
        1,
        4
      );

      // Offset from 0,0 being the center
      const { resultX, resultY } = getZoomPosition(
        x.goal,
        y.goal,
        target,
        clientX,
        clientY,
        scale.goal,
        nextScale
      );
      set({
        scale: nextScale,
        x: resultX,
        y: resultY,
      });
    },

    onPinch: ({ vdva: [distance, a], event, _pointerIds }) => {
      const nextScale = clamp((scale?.goal ?? 1) * 1.1 ** distance, 1, 4);
      if (event.type.includes("touch")) {
        const castEvent = event as React.TouchEvent<HTMLElement>;
        const { touches, target } = castEvent;

        const maybeTouch1 = touches[_pointerIds[0]];
        const maybeTouch2 = touches[_pointerIds[1]];

        let clientX;
        let clientY;
        if (maybeTouch1 && maybeTouch2) {
          clientX = (maybeTouch1.clientX + maybeTouch2.clientX) / 2;
          clientY = (maybeTouch1.clientY + maybeTouch2.clientY) / 2;
        } else if (maybeTouch1) {
          clientX = maybeTouch1.clientX;
          clientY = maybeTouch1.clientY;
        } else if (maybeTouch2) {
          clientX = maybeTouch2.clientX;
          clientY = maybeTouch2.clientY;
        } else {
          clientX = window.innerWidth / 2;
          clientY = window.innerHeight / 2;
        }

        const { resultX, resultY } = getZoomPosition(
          x.goal,
          y.goal,
          target,
          clientX,
          clientY,
          scale.goal,
          nextScale
        );

        set({
          scale: nextScale,
          x: resultX,
          y: resultY,
        });
      } else {
        set({
          scale: nextScale,
        });
      }
    },
  });

  return (
    <Box
      flex={false}
      ref={ref}
      height="100%"
      width="100%"
      justify="center"
      style={{
        position: "relative",
        overflow: "hidden",
        touchAction: "none",
        pointerEvents: "auto",
      }}
      {...bind()}
    >
      <animated.div
        style={{
          translate: to([x, y, scale], (x, y, scale) => [x * scale, y * scale]),
          scale: to([scale], (s) => s),
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* <AnimateTransform
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
      > */}
        <Grid
          fill="vertical"
          pad={isSmall ? "16px" : "48px"}
          areas={isSmall ? smallGridAreas : largeGridAreas}
          columns={isSmall ? smallGridColumns : largeGridColumns}
          rows={isSmall ? smallGridRows : largeGridRows}
          gap={"16px"}
        >
          <GridBoxes yearsShown={yearsShown} />
          <GridTextLabels yearsShown={yearsShown} />
        </Grid>
      </animated.div>
      {/* </AnimateTransform> */}
    </Box>
  );
});

const yearsInShownOrder = [2011, 2010, 2007, 2013, 2006, 2012] as const;
const yearInConsecutiveOrder = [2006, 2007, 2010, 2011, 2012, 2013] as const;

const smallGridAreas = [
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

const largeGridAreas = [
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

const smallGridRows = [
  "flex",
  "flex",
  "flex",
  "flex",
  "flex",
  "flex",
  "flex",
  "flex",
];
const smallGridColumns = ["auto", "flex"];
const largeGridColumns = smallGridRows;
const largeGridRows = [...smallGridColumns].reverse();

const zoomFactor = 3;

function getZoomPosition(
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

function GridBoxes({
  yearsShown,
}: {
  yearsShown: Set<2011 | 2010 | 2007 | 2013 | 2006 | 2012>;
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
          <StackedBoxes images={images[year]} />
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
  transition: opacity 1s, transform 1s;

  transform: ${({ isShown, slideDirection }) => {
    if (slideDirection === "LEFT") {
      return !isShown ? `translateX(100%)` : "translateX(0)";
    } else {
      return !isShown ? `translateY(-100%)` : "translateY(0)";
    }
  }};
`;

function GridTextLabels({
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
  return { translationX, translationY, elementCenterX, elementCenterY };
}
function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max));
}
