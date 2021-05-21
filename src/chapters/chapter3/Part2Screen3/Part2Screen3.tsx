import fromEntries from "fromentries";
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
import { store } from "src/store/store";
import useResizeObserver from "use-resize-observer/polyfilled";
import { CustomScrollbarBox } from "../../../components/CustomScrollbarBox";
import { Data } from "./components/Data";
import { HeaderBar } from "./components/HeaderBar";
import { ButtonCornerMapBox, FullScreenMapBox } from "./components/MapBox";
import { data } from "./data";
import {
  part2Screen3Store,
  usePart2Screen3Store,
} from "./store/part2Screen3Store";

export type Years = 2015 | 2016 | 2017 | 2019 | 2019;
const validYears = new Set(["2015", "2016", "2017", "2018", "2019"]);

export const Part2Screen3 = memo(({ seconds }: { seconds: number }) => {
  const isSmall = useContext(ResponsiveContext) === "small";

  const hideScrollBanner = useMemo(() => seconds >= 168, [seconds]);

  const currentPlayingAudio = usePart2Screen3Store(
    (state) => state.currentPlayingAudio
  );

  useEffect(() => {
    part2Screen3Store.setState({ currentPlayingAudio: undefined });
  }, []);

  useEffect(() => {
    if (currentPlayingAudio !== undefined) {
      store.getState().chapter?.setVolume(0);
    } else {
      store.getState().chapter?.setVolume(1);
    }
  }, [currentPlayingAudio]);

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

      const yearToBoundingBox = fromEntries(
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
        hidden={!isSmall}
        style={{ position: "relative" }}
      >
        <HeaderBar
          downloads={downloads}
          year={currentYear}
          onNavigationClicked={onNavigationClicked}
          onMapClicked={onMapClicked}
        />
        <Box style={{ position: "relative" }}>
          {!isSmall && <SpriteLevelIndicators />}
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
              <Data showAll={true} />
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
              <Data showAll={true} />
            </CustomScrollbarBox>
          )}
        </Box>
      </Box>
    </Box>
  );
});

Part2Screen3.displayName = "Part2Screen3";

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
        right: "0px",
        width: "18px",
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
        }}
      >
        {indicatorElements}
      </Box>
    </Box>
  );
});
