import { Text } from "grommet";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { data } from "../data";
import { Years } from "../Part2Screen3";
import { part2Screen3Store } from "../store/part2Screen3Store";
import { TextRow } from "./TextRow";

const startYear = 2015;
const years = [2015, 2016, 2017, 2018, 2019] as Years[];

export const Data = memo(({ showAll }: { showAll: boolean }) => {
  useEffect(() => {
    if (showAll === false) setTypingYear(startYear);
  }, [showAll]);

  const [typingYear, setTypingYear] = useState<2015 | 2016>(startYear);

  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    part2Screen3Store.setState({ container: ref });

    return () => {
      part2Screen3Store.setState({ container: undefined });
    };
  }, []);

  const textRows = useMemo(
    () =>
      years.map((year) => {
        const entries = data[year as keyof typeof data];
        return (
          <TextRow
            key={year}
            year={year}
            entries={entries}
            state={
              showAll || typingYear > year
                ? "SHOW_ALL"
                : typingYear === year
                ? "TYPING"
                : "SHOW_NONE"
            }
            onFinished={() =>
              setTypingYear(Math.max(year + 1, startYear + 1) as 2015 | 2016)
            }
          />
        );
      }),
    [showAll, typingYear]
  );
  return (
    <Text ref={ref} style={{ userSelect: "none" }}>
      {textRows}
    </Text>
  );
});

export const getSegmentState = (
  segmentId: number,
  currentSegment: number,
  parentState: "SHOW_ALL" | "TYPING" | "SHOW_NONE"
) => {
  if (parentState !== "TYPING") return parentState;

  if (currentSegment < segmentId) return "SHOW_NONE";
  if (currentSegment === segmentId) return "TYPING";
  return "SHOW_ALL";
};

export function segmentIsString(
  segment:
    | { type: "string"; entries: string[] }
    | { type: "logo"; logoName: string; companyName: string }
): segment is { type: "string"; entries: string[] } {
  return segment.type === "string";
}

export function entryIsLogo(
  entry: { logo: string; entry: string } | { entry: string }
): entry is { logo: string; entry: string } {
  return (entry as { logo: string }).logo !== undefined;
}
