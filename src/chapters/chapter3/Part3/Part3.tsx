import { Box, Grid, ResponsiveContext } from "grommet";
import { memo, useContext, useEffect, useRef } from "react";
import { animated } from "react-spring";
import { useScreenAspect } from "src/hooks/useScreenAspect";
import { Pings } from "../components/Pings";
import { usePanZoomControl } from "../hooks/usePanZoomControl";
import { useZoomOnElement } from "../hooks/useZoomOnElement";
import {
  largeGridAreas,
  largeGridColumns,
  largeGridRows,
  PileBoxes,
  PileTextLabels,
  smallGridAreas,
  smallGridColumns,
  smallGridRows,
} from "./components/PileLayout";
import { part3Store, Tinting, usePart3Store } from "./store/Part3Store";

interface Part3Props {
  stage: "NO_TINTING" | "WEDDING" | "PARTY" | "FAMILY" | "USER_CONTROL";
}

const stageProgress = [
  "NO_TINTING",
  "WEDDING",
  "PARTY",
  "FAMILY",
  "USER_CONTROL",
] as const;

function stageIsAfter(stage: Part3Props["stage"], point: Part3Props["stage"]) {
  const stageIndex = stageProgress.findIndex((test) => test === stage);
  const pointIndex = stageProgress.findIndex((test) => test === point);

  return stageIndex > pointIndex;
}

export const Part3Selector = ({ seconds }: { seconds: number }) => {
  let stage: Part3Props["stage"];

  if (seconds < 173) {
    stage = "NO_TINTING";
  } else if (seconds < 177) {
    stage = "WEDDING";
  } else if (seconds < 181) {
    stage = "PARTY";
  } else if (seconds < 200) {
    stage = "FAMILY";
  } else {
    stage = "USER_CONTROL";
  }

  return <Part3 stage={stage} />;
};

const Part3 = memo(({ stage }: Part3Props) => {
  const ref = useRef<HTMLDivElement>(null);

  let isSmall = useContext(ResponsiveContext) === "small";

  const aspect = useScreenAspect();
  if (aspect < 1) {
    isSmall = true;
  }

  const { bind, transform, start, x, y, scale } = usePanZoomControl(false);

  useEffect(() => {
    part3Store.setState({
      focusedElement: undefined,
      tinting: new Set(),
    });
  }, []);

  const focusedElement = usePart3Store((state) => state.focusedElement);
  useZoomOnElement(ref, focusedElement, start, x, scale, y, 3);

  useEffect(() => {
    if (!ref.current) return;

    if (stage === "USER_CONTROL") {
      part3Store.setState({
        userControl: true,
      });
    } else {
      part3Store.setState({
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
    part3Store.getState().setTinting(tinting);
  }, [stage]);

  const isFocused = usePart3Store(
    (state) => state.focusedElement !== undefined
  );

  const imageCards = usePart3Store((state) => state.autoPickableImageCards);

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
        paddingBottom: "16px",
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
          <PileBoxes />
          <PileTextLabels />
        </Grid>
        {stage === "USER_CONTROL" && (
          <Pings isFocused={isFocused} imageCards={imageCards} />
        )}
      </animated.div>
    </Box>
  );
});
