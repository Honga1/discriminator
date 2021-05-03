import { Box, Grid, ResponsiveContext } from "grommet";
import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { animated, to, useSpring } from "react-spring";
import { useGesture } from "react-use-gesture";
import { useAnimationFrame } from "../../../hooks/useAnimationFrame";
import { clamp } from "../../../libs/math";
import { usePanZoomControl } from "../usePanZoomControl";
import {
  getZoomPosition,
  GridBoxes,
  GridTextLabels,
  largeGridAreas,
  largeGridColumns,
  largeGridRows,
  smallGridAreas,
  smallGridColumns,
  smallGridRows,
} from "./GridLayout";
import {
  part1Screen2Store,
  Years,
  yearsInShownOrder,
} from "./Part1Screen2Store";

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

  const isSmall = useContext(ResponsiveContext) === "small";

  const [shouldShowElements, setShouldShowElements] = useState<
    Set<HTMLElement>
  >(new Set());

  const [yearsShown, setYearsShown] = useState(new Set<Years>());

  const { bind, transform, api, scale, x, y } = usePanZoomControl(
    stage === "USER_CONTROL"
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

    api.start({
      x: 0,
      y: 0,
      scale: 1,
    });

    const index = yearsInShownOrder.findIndex(
      (year) => year === parseInt(stage, 10)
    );
    const shown = yearsInShownOrder.slice(0, index + 1);
    setYearsShown(new Set(shown));
  }, [api, stage]);

  // Handles automated movement
  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;

    if (typeof stage !== "number") {
      return;
    }

    const image = stage;
    const elements = container.getElementsByClassName("auto-pickable");
    const choice = elements[image] as HTMLDivElement | undefined;
    if (!choice) {
      console.warn(
        `Could not find image: ${image} from elements: ${Array.from(elements)}`
      );
      return;
    }

    const containerBb = container.getBoundingClientRect();
    const bb = choice.getBoundingClientRect();
    const distanceFromCenterX =
      (bb.left + bb.right) / 2 - containerBb.width / 2 + containerBb.left;
    const distanceFromCenterY =
      (bb.top + bb.bottom) / 2 - containerBb.height / 2 + containerBb.top;

    api.start({
      x: x.get() - distanceFromCenterX / scale.get(),
      y: y.get() - distanceFromCenterY / scale.get(),
      scale: 4,
    });

    if (!shouldShowElements.has(choice)) {
      setShouldShowElements(new Set([...shouldShowElements, choice]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Shows elements every 1 second if they're within 10% of the center of the screen
  useAnimationFrame(1, () => {
    if (!ref.current) return;
    if (stage !== "USER_CONTROL") return;
    const container = ref.current;
    const elements = container.getElementsByClassName("image-card");

    const containerBb = container.getBoundingClientRect();
    const nextShownElements = new Set<HTMLElement>();

    for (const key in elements) {
      if (Object.prototype.hasOwnProperty.call(elements, key)) {
        const element = elements[key]! as HTMLElement;

        const bb = element.getBoundingClientRect();

        const distanceFromCenterX =
          ((bb.left + bb.right) / 2 - containerBb.width / 2) /
          containerBb.width;
        const distanceFromCenterY =
          ((bb.top + bb.bottom) / 2 - containerBb.height / 2) /
          containerBb.height;

        const distance =
          Math.hypot(distanceFromCenterX, distanceFromCenterY) <
          0.1 * scale.get();
        if (distance) {
          nextShownElements.add(element);
        }
      }
    }

    if (nextShownElements.size !== 0) {
      setShouldShowElements(nextShownElements);
    }
  });

  useEffect(() => {
    part1Screen2Store.getState().setTinting(new Set());
    part1Screen2Store.getState().setYearsShown(yearsShown);
    part1Screen2Store.getState().setRevealedImages(shouldShowElements);
  }, [shouldShowElements, yearsShown]);

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
          transform: transform,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        <Grid
          fill="vertical"
          pad={isSmall ? "16px" : "48px"}
          areas={isSmall ? smallGridAreas : largeGridAreas}
          columns={isSmall ? smallGridColumns : largeGridColumns}
          rows={isSmall ? smallGridRows : largeGridRows}
          gap={"16px"}
        >
          <GridBoxes />
          <GridTextLabels />
        </Grid>
      </animated.div>
    </Box>
  );
});
