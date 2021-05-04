import { Box, Grid, ResponsiveContext } from "grommet";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { animated } from "react-spring";
import { usePanZoomControl } from "../usePanZoomControl";
import {
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
  usePart1Screen2Store,
  Years,
  yearsInShownOrder,
} from "./Part1Screen2Store";
import { Pings } from "./Pings";
import { useZoomOnElement } from "./useZoomOnElement";

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
  } else if (seconds < 57) {
    stage = "2012";
  } else if (seconds < 61) {
    //  I see you
    stage = 0;
  } else if (seconds < 66) {
    // "A kid with a pumpkin" ZOOMIN 1
    stage = 1;
  } else if (seconds < 72) {
    // "I see, looks like you" ZOOMIN 2
    stage = 2;
  } else if (seconds < 77) {
    // "There's a woman" ZOOMIN 3
    stage = 3;
  } else if (seconds < 82) {
    //  "There's you" ZOOMIN 4
    stage = 4;
  } else if (seconds < 93) {
    stage = 5;
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
    | 5
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

  const [yearsShown, setYearsShown] = useState(new Set<Years>());

  const { bind, transform, api, scale, x, y } = usePanZoomControl(false);

  useEffect(() => {
    part1Screen2Store.setState({
      focusedElement: undefined,
      revealedImage: undefined,
      tinting: new Set(),
      showData: true,
      yearsShown: new Set(),
    });
  }, []);

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

    if (stage === "ZOOMED_OUT") {
      part1Screen2Store.setState({
        focusedElement: undefined,
      });
    }

    if (stage === "USER_CONTROL") {
      part1Screen2Store.setState({
        userControl: true,
      });
    } else {
      part1Screen2Store.setState({
        userControl: false,
      });
    }

    if (typeof stage !== "number") {
      return;
    }

    let choice: HTMLElement | undefined;
    const cardsMap = part1Screen2Store.getState().autoPickableImageCards;

    switch (stage) {
      case 0:
        choice = cardsMap.get("1073107755_93470b17e6")?.current ?? undefined;
        break;
      case 1:
        choice = cardsMap.get("5181112588_6527bc8401")?.current ?? undefined;
        break;
      case 2:
        choice = cardsMap.get("541454120_ba1028b86e")?.current ?? undefined;
        break;
      case 3:
        choice = cardsMap.get("356480744_03c2c3232b")?.current ?? undefined;
        break;
      case 4:
        choice = cardsMap.get("102631694_ddcba3652b")?.current ?? undefined;
        break;
      case 5:
        choice = cardsMap.get("4760348817_8b3d967eef")?.current ?? undefined;
        break;
    }

    if (!choice) {
      console.warn(`Could not find image: ${stage} from elements: ${cardsMap}`);
      return;
    }

    part1Screen2Store.setState({ focusedElement: choice });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const focusedElement = usePart1Screen2Store((state) => state.focusedElement);
  useZoomOnElement(ref, focusedElement, api, x, scale, y, 1);
  useRevealOnFocus();

  useEffect(() => {
    part1Screen2Store.getState().setTinting(new Set());
    part1Screen2Store.getState().setYearsShown(yearsShown);
  }, [yearsShown]);

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
        {stage === "USER_CONTROL" && <Pings></Pings>}
      </animated.div>
    </Box>
  );
});

function useRevealOnFocus() {
  const focusedElement = usePart1Screen2Store((state) => state.focusedElement);

  useEffect(() => {
    part1Screen2Store.setState({ revealedImage: focusedElement });
  }, [focusedElement]);
}
