import { Text } from "grommet";
import { memo, useEffect, useMemo, useState } from "react";
import { audio as audioSources } from "../audio/audio";
import { logos } from "../logos/logos";
import { SpriteText } from "./SpriteText";
import { TypingText } from "./TypingText";
import { entryIsLogo, segmentIsString, getSegmentState } from "./Data";

export const TextRow = memo(
  ({
    year,
    entries,
    onFinished,
    state,
  }: {
    state: "SHOW_ALL" | "TYPING" | "SHOW_NONE";
    year: number;
    entries: (
      | { logo: keyof typeof logos; entry: string }
      | { entry: string }
    )[];
    onFinished: () => void;
  }) => {
    const segments = useMemo(() => {
      const segments: (
        | {
            type: "string";
            entries: string[];
          }
        | { type: "logo"; logoName: keyof typeof logos; companyName: string }
      )[] = [];

      entries.forEach((entry) => {
        const lastSegment = segments[segments.length - 1];
        if (lastSegment === undefined) {
          if (entryIsLogo(entry)) {
            segments.push({
              type: "logo",
              logoName: entry.logo,
              companyName: entry.entry,
            });
          } else {
            segments.push({ type: "string", entries: [entry.entry] });
          }
          return;
        }

        if (entryIsLogo(entry)) {
          segments.push({
            type: "logo",
            logoName: entry.logo,
            companyName: entry.entry,
          });
        } else {
          if (segmentIsString(lastSegment)) {
            lastSegment.entries.push(entry.entry);
          } else {
            segments.push({ type: "string", entries: [entry.entry] });
          }
        }
      });
      return segments;
    }, [entries]);

    const [currentSegment, setSegment] = useState(0);

    useEffect(() => {
      if (currentSegment === segments.length + 1) onFinished();
    }, [currentSegment, onFinished, segments.length]);

    const textSegments = useMemo(
      () =>
        segments.map((segmentData, segmentIndex) => {
          if (segmentData.type === "logo") {
            const audioFile = audioSources[segmentData.logoName];

            if (!audioFile)
              throw new Error(
                `Could not find ${segmentData.logoName} in ${Object.keys(
                  audioSources
                )}`
              );
            return (
              <SpriteText
                key={segmentIndex}
                audioSrc={audioFile}
                logoSrc={logos[segmentData.logoName]}
                text={segmentData.companyName}
                onFinished={() => setSegment(segmentIndex + 2)}
                state={getSegmentState(segmentIndex + 1, currentSegment, state)}
              />
            );
          } else {
            return (
              <TypingText
                bold={false}
                key={segmentIndex}
                text={`${segmentData.entries.join("   •••   ")}   •••   `}
                state={getSegmentState(segmentIndex + 1, currentSegment, state)}
                onFinished={() => setSegment(segmentIndex + 2)}
              />
            );
          }
        }),
      [currentSegment, segments, state]
    );
    return (
      <Text
        className={`TextRow year${year}`}
        data-year={year}
        style={{ whiteSpace: "pre-wrap", display: "relative" }}
      >
        <TypingText
          bold={true}
          text={year.toFixed(0) + "   "}
          state={getSegmentState(0, currentSegment, state)}
          onFinished={() => setSegment(1)}
        />

        {textSegments}
      </Text>
    );
  }
);

TextRow.displayName = "TextRow";
