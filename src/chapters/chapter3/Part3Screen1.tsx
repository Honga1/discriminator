import { Box, Grid, ResponsiveContext, Text } from "grommet";
import { memo, useContext, useEffect, useRef } from "react";
import { animated } from "react-spring";
import {
  GridBoxes,
  GridTextLabels,
  largeGridAreas,
  largeGridColumns,
  largeGridRows,
  smallGridAreas,
  smallGridColumns,
  smallGridRows,
} from "./Part1Screen2/GridLayout";
import {
  part1Screen2Store,
  Tinting,
  usePart1Screen2Store,
  yearsInShownOrder,
} from "./Part1Screen2/Part1Screen2Store";
import { Pings } from "./Part1Screen2/Pings";
import { useZoomOnElement } from "./Part1Screen2/useZoomOnElement";
import { usePanZoomControl } from "./usePanZoomControl";

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
  } else if (seconds < 218) {
    stage = "FAMILY";
  } else {
    stage = "USER_CONTROL";
  }

  return <Part3Screen1 stage={stage} />;
};

const Part3Screen1 = memo(({ stage }: Part3Screen1Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const isSmall = useContext(ResponsiveContext) === "small";

  const { bind, transform, api, x, y, scale } = usePanZoomControl(false);

  useEffect(() => {
    part1Screen2Store.setState({
      focusedElement: undefined,
      revealedImage: "SHOW_ALL",
      tinting: new Set(),
      showData: false,
      yearsShown: new Set(yearsInShownOrder),
    });
  }, []);

  const focusedElement = usePart1Screen2Store((state) => state.focusedElement);
  useZoomOnElement(ref, focusedElement, api, x, scale, y, 3);

  useEffect(() => {
    if (!ref.current) return;

    if (stage === "USER_CONTROL") {
      part1Screen2Store.setState({
        userControl: true,
      });
    } else {
      part1Screen2Store.setState({
        userControl: false,
      });
    }
  }, [stage]);

  useEffect(() => {
    const tinting = new Set<Tinting>();
    if (stageIsAfter(stage, "NO_TINTING")) {
      tinting.add("wedding");
    }
    if (stageIsAfter(stage, "WEDDING")) {
      tinting.add("party");
    }
    if (stageIsAfter(stage, "PARTY")) {
      tinting.add("family");
    }
    part1Screen2Store.getState().setTinting(tinting);
  }, [stage]);

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
        {stage === "USER_CONTROL" && <Pings></Pings>}
      </animated.div>
    </Box>
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
