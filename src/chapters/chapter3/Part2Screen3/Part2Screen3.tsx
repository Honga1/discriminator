import { useSpring } from "@react-spring/core";
import { Box, ResponsiveContext } from "grommet";
import { throttle } from "lodash";
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useResizeObserver from "use-resize-observer";
import { default as createStore } from "zustand";
import create from "zustand/vanilla";
import { CustomScrollbarBox } from "../../../components/CustomScrollbarBox";
import { ButtonCornerMapBox, FullScreenMapBox } from "../MapBox";
import { Data } from "./Data";
import { data } from "./data";
import { HeaderBar } from "./HeaderBar";
import { ScrollBanner } from "./ScrollBanner";

export type Years = 2015 | 2016 | 2017 | 2019 | 2019;
const validYears = new Set(["2015", "2016", "2017", "2018", "2019"]);

export const Part2Screen3 = memo(({ seconds }: { seconds: number }) => {
  const isSmall = useContext(ResponsiveContext) === "small";

  const hideScrollBanner = useMemo(() => seconds >= 168, [seconds]);

  const [currentYear, setCurrentYear] = useState<Years>(2015);
  const [downloads, setDownloads] = useState(0);
  const scrollBox = useRef<HTMLDivElement>(null);

  const [showFullScreenMap, setShowFullScreenMap] = useState(false);

  const onNavigationClicked = useCallback((year: Years): void => {
    if (!scrollBox.current) return;

    const yearElement = scrollBox.current.querySelector(`.year${year}`) as
      | HTMLDivElement
      | undefined;

    if (!yearElement) return;

    yearElement.scrollIntoView();
    setCurrentYear(year);
  }, []);

  const [, api] = useSpring(() => ({
    y: 0,
  }));

  useEffect(() => {
    if (seconds > 174) {
      part2Screen3Store.setState({ isInteractive: true });
    } else {
      part2Screen3Store.setState({ isInteractive: false });
    }
  }, [seconds]);

  useEffect(() => {
    if (seconds >= 168 && seconds < 176) {
      api.start({
        y: 2000,
        config: { duration: 8000, easing: easeInOutSine },
        onChange: (result) => scrollBox.current?.scroll(0, result.value.y),
      });
      return;
    }
  }, [api, seconds]);

  const onScroll: React.UIEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const yearElements = (event.target as HTMLElement).querySelectorAll(
        ".TextRow"
      ) as NodeListOf<HTMLDivElement> | undefined;
      if (!yearElements) return;

      type Entries = ["2015" | "2016" | "2017" | "2018" | "2019", DOMRect];

      const getValidBoundingBoxes = (
        element: HTMLDivElement
      ): Entries | undefined => {
        const maybeYear = element.attributes.getNamedItem("data-year")?.value;
        if (!maybeYear) return undefined;
        if (!validYears.has(maybeYear)) return undefined;

        return [maybeYear, element.getBoundingClientRect()] as Entries;
      };

      const filterInvalid = (value: Entries | undefined): value is Entries =>
        value !== undefined;

      const yearToBoundingBox = Object.fromEntries(
        [...yearElements.values()]
          .map(getValidBoundingBoxes)
          .filter(filterInvalid)
      );

      // Set banner year
      let nextYear: Years = 2015;
      const heightOfOneLine = 72;
      Object.entries(yearToBoundingBox).forEach(([year, { top }]) => {
        if (top >= heightOfOneLine) return;
        const maybeYear = parseInt(year);
        nextYear = Math.max(maybeYear, nextYear) as Years;
      });
      currentYear !== nextYear && setCurrentYear(nextYear);

      // Set banner downloads
      if (isSmall) return;
      const currentYearRect = yearToBoundingBox[nextYear];
      if (!currentYearRect) return;
      const { top, height } = currentYearRect;
      const progress = (-top + heightOfOneLine) / height;
      const dataYearIndex = nextYear - 2015;
      const yearsInOrder = [2015, 2016, 2017, 2018, 2019];
      const yearsBeforeThisOne = yearsInOrder.slice(0, dataYearIndex);

      const downloadsBeforeThisYear = yearsBeforeThisOne.flatMap((year) =>
        Array.from({ length: data[year as keyof typeof data].length })
      ).length;
      const estimatedDownloadsUpToScrollPoint = Math.max(
        data[nextYear as keyof typeof data].length * progress,
        0
      );
      const downloads = Math.floor(
        estimatedDownloadsUpToScrollPoint + downloadsBeforeThisYear
      );
      setDownloads(downloads);
    },
    [currentYear, isSmall]
  );

  const throttledScroll = useMemo(() => throttle(onScroll, 100), [onScroll]);
  const onMapBoxClose = useCallback(() => setShowFullScreenMap(false), []);
  const onMapClicked = useCallback(() => setShowFullScreenMap(true), []);
  return (
    <Box
      flex={false}
      height="100%"
      width="100%"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {showFullScreenMap && isSmall && (
        <FullScreenMapBox onClose={onMapBoxClose} />
      )}

      <Box
        flex={false}
        height="100%"
        width="100%"
        pad="4px"
        hidden={!showFullScreenMap || !isSmall}
        style={{ position: "relative" }}
      >
        <HeaderBar
          isShown={true}
          downloads={downloads}
          year={currentYear}
          onNavigationClicked={onNavigationClicked}
          onMapClicked={onMapClicked}
        />
        <Box>
          <ScrollBanner isShown={!hideScrollBanner} />
          {!isSmall && <ButtonCornerMapBox isShown={hideScrollBanner} />}
          {isSmall ? (
            <Box
              height="100%"
              width="100%"
              overflow={{ horizontal: "hidden", vertical: "auto" }}
              pad={"8px"}
              ref={scrollBox}
              onScroll={onScroll}
            >
              <Data showAll={seconds >= 167} />
            </Box>
          ) : (
            <CustomScrollbarBox
              height="100%"
              width="100%"
              overflow={{ horizontal: "hidden", vertical: "auto" }}
              pad={"8px"}
              ref={scrollBox}
              onScroll={throttledScroll}
            >
              <Data showAll={seconds >= 167} />
            </CustomScrollbarBox>
          )}
          {seconds >= 176 && <SpriteLevelIndicators />}
        </Box>
      </Box>
    </Box>
  );
});

Part2Screen3.displayName = "Part2Screen3";

function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

export const part2Screen3Store = create<{
  sprites: Set<{ current: HTMLSpanElement | null }>;
  container: { current: HTMLSpanElement | null } | undefined;
  isInteractive: boolean;
}>((set, get) => ({
  container: undefined,
  isInteractive: false,
  sprites: new Set<{ current: HTMLSpanElement | null }>(),
}));

const usePart2Screen3Store = createStore(part2Screen3Store);

const SpriteLevelIndicators = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const indicators = usePart2Screen3Store((state) => state.sprites);
  const container = usePart2Screen3Store((state) => state.container);

  const { height } = useResizeObserver({ ref: container });

  const [positions, setPositions] = useState<number[]>([]);

  useEffect(() => {
    const positions = [...indicators].flatMap((indicator) => {
      if (!indicator.current) return [];
      if (!height || height === 0) return [];

      return indicator.current.getBoundingClientRect().top / height;
    });
    setPositions(positions);
  }, [height, indicators]);

  const indicatorElements = useMemo(
    () =>
      positions.map((distance, key) => {
        return (
          <Box
            key={key}
            background="greenLight"
            width="100%"
            height="2px"
            style={{ position: "absolute", top: distance * 100 + "%" }}
          ></Box>
        );
      }),
    [positions]
  );
  return (
    <Box
      ref={ref}
      style={{
        position: "absolute",
        height: "100%",
        right: "4px",
        width: "20px",
        overflow: "hidden",
        pointerEvents: "none",
        touchAction: "none",
      }}
    >
      <Box
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      >
        {indicatorElements}
      </Box>
    </Box>
  );
});
