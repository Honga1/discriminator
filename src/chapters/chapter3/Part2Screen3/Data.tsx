import { Text } from "grommet";
import { memo, useEffect, useRef, useState } from "react";
import { data } from "./data";
import { part2Screen3Store } from "./Part2Screen3";
import { TextRow } from "./TextRow";

type Years = keyof typeof data;
const years = [2015, 2016, 2017, 2018, 2019] as Years[];
const startYear = 2015;

export type SpriteNames =
  | "advertima"
  | "affectiva"
  | "amazon"
  | "bytedance"
  | "csiac"
  | "dfat"
  | "digitalbarriers"
  | "esteelauder"
  | "europol"
  | "facebook"
  | "google"
  | "hikvision"
  | "huawei"
  | "inqtel"
  | "intel"
  | "kipod"
  | "nc3"
  | "nec"
  | "noblis"
  | "northropgrumman"
  | "nudt"
  | "nvidia"
  | "sensetime"
  | "smartcheckr"
  | "tencent"
  | "turkishpolice"
  | "uncannyvision";

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

  return (
    <Text ref={ref} style={{ userSelect: "none" }}>
      {years.map((year) => {
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
      })}
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
