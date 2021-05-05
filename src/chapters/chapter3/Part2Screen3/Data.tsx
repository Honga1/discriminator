import { ResponsiveContext, Text } from "grommet";
import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAnimationFrame } from "src/hooks/useAnimationFrame";
import logos from "./logos/logos";
import { data } from "./data";

export const Data = memo(({ showAll }: { showAll: boolean }) => {
  const years = useMemo(
    () => Object.keys(data).map((year) => parseInt(year, 10)),
    []
  );
  const startYear = useMemo(() => Math.min(...years), [years]);
  useEffect(() => {
    if (showAll === false) setTypingYear(startYear);
  }, [showAll, startYear]);

  const [typingYear, setTypingYear] = useState(startYear);

  return (
    <Text style={{ userSelect: "none" }}>
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
            onFinished={() => setTypingYear(Math.max(year + 1, startYear + 1))}
          />
        );
      })}
    </Text>
  );
});

function TextRow({
  year,
  entries,
  onFinished,
  state,
}: {
  state: "SHOW_ALL" | "TYPING" | "SHOW_NONE";
  year: number;
  entries: ({ logo: string; entry: string } | { entry: string })[];
  onFinished: () => void;
}) {
  const segments: { type: "logo" | "string"; entries: string[] }[] = [];

  entries.forEach((entry) => {
    const lastSegment = segments[segments.length - 1];
    const isFirstSegment = lastSegment === undefined;
    if (isFirstSegment) {
      if (entryIsLogo(entry)) {
        segments.push({ type: "logo", entries: [entry.logo] });
        segments.push({ type: "string", entries: [entry.entry] });
      } else {
        segments.push({ type: "string", entries: [entry.entry] });
      }
      return;
    }

    const lastSegmentType = lastSegment!.type;

    if (entryIsLogo(entry)) {
      if (lastSegmentType === "logo") {
        lastSegment!.entries.push(entry.logo);
        segments.push({ type: "string", entries: [entry.entry] });
      } else {
        segments.push({ type: "logo", entries: [entry.logo] });
        segments.push({ type: "string", entries: [entry.entry] });
      }
    } else {
      if (lastSegmentType === "string") {
        lastSegment!.entries.push(entry.entry);
      } else {
        segments.push({ type: "string", entries: [entry.entry] });
      }
    }
  });

  const [segment, setSegment] = useState(0);
  const isSmall = useContext(ResponsiveContext) === "small";

  return (
    <Text
      className={`TextRow year${year}`}
      data-year={year}
      style={{ whiteSpace: "pre-wrap", display: "relative" }}
    >
      <TypingText
        bold={true}
        text={year.toFixed(0) + "   "}
        state={getSegmentState(0, segment, state)}
        onFinished={() => setSegment(1)}
      />

      {segments.map(({ type, entries }, segmentIndex) => {
        if (type === "logo") {
          return entries.map((logoName) => {
            console.log(logoName);
            return (
              <>
                <img
                  style={{ height: "1em" }}
                  src={logos[logoName as keyof typeof logos]}
                  alt="logo"
                />
                <Text
                  color="offWhite"
                  size={isSmall ? "20px" : "24px"}
                  style={{ lineHeight: isSmall ? "40px" : "72px" }}
                >
                  {"   "}
                  •••{"   "}
                </Text>
              </>
            );
          });
        } else {
          return (
            <TypingText
              bold={false}
              text={`${entries.join("   •••   ")}   •••   `}
              state={getSegmentState(1, segment, state)}
              onFinished={() => onFinished()}
            />
          );
        }
      })}
    </Text>
  );
}

const getSegmentState = (
  segmentId: number,
  currentSegment: number,
  parentState: "SHOW_ALL" | "TYPING" | "SHOW_NONE"
) => {
  if (parentState !== "TYPING") return parentState;

  if (currentSegment < segmentId) return "SHOW_NONE";
  if (currentSegment === segmentId) return "TYPING";
  return "SHOW_ALL";
};

function entryIsLogo(
  entry: { logo: string; entry: string } | { entry: string }
): entry is { logo: string; entry: string } {
  return (entry as { logo: string }).logo !== undefined;
}

function TypingText({
  text,
  state,
  onFinished,
  bold,
}: {
  bold: boolean;
  text: string;
  state: "SHOW_ALL" | "TYPING" | "SHOW_NONE";
  onFinished: () => void;
}) {
  const queuedCharactersShown = useRef(0);
  const [charactersShown, setCharactersShown] = useState(
    queuedCharactersShown.current
  );
  const isSmall = useContext(ResponsiveContext) === "small";
  const interval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    switch (state) {
      case "SHOW_ALL": {
        queuedCharactersShown.current = text.length + 1;
        return;
      }
      case "SHOW_NONE": {
        queuedCharactersShown.current = 0;
        return;
      }

      case "TYPING": {
        if (interval.current) clearInterval(interval.current);
        interval.current = setInterval(() => {
          queuedCharactersShown.current = Math.min(
            queuedCharactersShown.current + 4,
            text.length + 1
          );
        }, 4);
        return () => {
          if (interval.current) clearInterval(interval.current);
        };
      }
    }
  }, [state, text.length]);

  useAnimationFrame(60, () => {
    setCharactersShown(queuedCharactersShown.current);
  });

  useEffect(() => {
    if (charactersShown >= text.length + 1) onFinished();
  }, [charactersShown, onFinished, text.length]);

  const slicedText = text.slice(0, charactersShown);
  const remainingText = text.slice(charactersShown, text.length);

  return (
    <Text style={{ whiteSpace: "pre-wrap" }}>
      <Text
        weight={bold ? "bold" : "normal"}
        color="offWhite"
        size={isSmall ? "20px" : "24px"}
        style={{ lineHeight: isSmall ? "40px" : "72px" }}
      >
        {slicedText}
      </Text>
      <Text
        weight={bold ? "bold" : "normal"}
        size={isSmall ? "20px" : "24px"}
        style={{ lineHeight: isSmall ? "40px" : "72px", opacity: 0 }}
      >
        {remainingText}
      </Text>
    </Text>
  );
}
