import { ResponsiveContext, Text } from "grommet";
import { memo, useContext, useEffect, useRef, useState } from "react";

export const TypingText = memo(
  ({
    text,
    state,
    onFinished,
    bold,
  }: {
    bold: boolean;
    text: string;
    state: "SHOW_ALL" | "TYPING" | "SHOW_NONE";
    onFinished: () => void;
  }) => {
    const queuedCharactersShown = useRef(0);
    const [charactersShown, setCharactersShown] = useState(
      queuedCharactersShown.current
    );
    const isSmall = useContext(ResponsiveContext) === "small";
    const interval = useRef<NodeJS.Timeout>();

    useEffect(() => {
      switch (state) {
        case "SHOW_ALL": {
          setCharactersShown(text.length + 1);
          return;
        }
        case "SHOW_NONE": {
          setCharactersShown(0);
          return;
        }

        case "TYPING": {
          if (interval.current) clearInterval(interval.current);
          interval.current = setInterval(() => {
            requestAnimationFrame(() => {
              setCharactersShown((charactersShown) =>
                Math.min(charactersShown + 4, text.length + 1)
              );
            });
          }, 4);
          return () => {
            if (interval.current) clearInterval(interval.current);
          };
        }
      }
    }, [state, text.length]);

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
);

TypingText.displayName = "TypingText";
