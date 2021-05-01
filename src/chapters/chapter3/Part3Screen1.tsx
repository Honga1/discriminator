import { Box, Grid, ResponsiveContext, Text } from "grommet";
import React, { memo, useContext, useEffect, useMemo, useRef } from "react";
import { animated, SpringValue, to, useSpring } from "react-spring";
import { useGesture } from "react-use-gesture";
import { clamp } from "../../libs/math";
import {
  Part1Screen2Provider,
  Tinting,
} from "./Part1Screen2/Part1Screen2Context";
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
} from "./Part1Screen2/GridLayout";

interface Part3Screen1Props {
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

  if (seconds < 191) {
    stage = "NO_TINTING";
  } else if (seconds < 195) {
    stage = "WEDDING";
  } else if (seconds < 199) {
    stage = "PARTY";
  } else if (seconds < 221) {
    stage = "FAMILY";
  } else {
    stage = "USER_CONTROL";
  }

  return <Part3Screen1 stage={stage} />;
};

const Part3Screen1 = memo(({ stage }: Part3Screen1Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const isSmall = useContext(ResponsiveContext) === "small";

  const spring = useSpring(
    () => ({
      x: 0,
      y: 0,
      scale: 1,
      drag: false,
    }),
    []
  );

  const [values, set] = spring;
  const { x, y, scale } = values as {
    x: SpringValue<number> | undefined;
    y: SpringValue<number> | undefined;
    scale: SpringValue<number> | undefined;
    drag: SpringValue<boolean> | undefined;
  };

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;

    const elements = container.getElementsByClassName("auto-pickable");
    for (const key in elements) {
      if (Object.prototype.hasOwnProperty.call(elements, key)) {
        const element = elements[key]! as HTMLElement;
        element.classList.add("is-picked");
      }
    }
  }, []);

  const bind = useGesture({
    onDrag: ({ delta: [deltaX, deltaY], event, pinching }) => {
      event.preventDefault();

      !pinching &&
        set({
          x: x?.goal ?? 0 + deltaX / (scale?.goal ?? 1),
          y: y?.goal ?? 0 + deltaY / (scale?.goal ?? 1),
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
        x?.goal ?? 0,
        y?.goal ?? 0,
        target,
        clientX,
        clientY,
        scale?.goal ?? 1,
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
          x?.goal ?? 0,
          y?.goal ?? 0,
          target,
          clientX,
          clientY,
          scale?.goal ?? 1,
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

  const tinting = useMemo(() => {
    const tinting = new Set<Tinting>();
    if (stageIsAfter(stage, "NO_TINTING")) {
      tinting.add("wedding");
    }
    if (stageIsAfter(stage, "WEDDING")) {
      tinting.add("family");
    }
    if (stageIsAfter(stage, "FAMILY")) {
      tinting.add("party");
    }
    return tinting;
  }, [stage]);

  return (
    <Part1Screen2Provider tinting={tinting}>
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
            translate:
              x && y && scale
                ? to([x, y, scale], (x, y, scale) => [x * scale, y * scale])
                : [0, 0],
            scale: scale ? to([scale], (s) => s) : 1,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            willChange: "transform",
          }}
        >
          <CategoryLabels stage={stage} />

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
    </Part1Screen2Provider>
  );
});

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
