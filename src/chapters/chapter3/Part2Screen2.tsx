import { Box, Text } from "grommet";
import { Fragment, memo, useEffect, useRef, useState } from "react";
import { colorTheme } from "../../theme";

export const Part2Screen2 = ({ seconds }: { seconds: number }) => {
  return (
    <Box
      flex={false}
      direction="column"
      gap="48px"
      width="100%"
      height="100%"
      pad="4px"
      justify="center"
      align="center"
    >
      <Box align="center">
        {seconds < 130 && (
          <RollingText
            yearShown={seconds > 127 ? 2019 : 2015}
            shouldDelete={seconds > 130}
          />
        )}
        {seconds >= 130 && seconds < 138 && (
          <Text size="48px" style={{ lineHeight: "48px" }}>
            <TypingText
              // super neuro
              text={2015 + ""}
              color={colorTheme.redLight}
              shouldDelete={seconds > 136}
            />
          </Text>
        )}
        {seconds >= 138 && seconds < 143 && (
          <Text size="48px" style={{ lineHeight: "48px" }}>
            <TypingText
              // Uni
              text={2015 + ""}
              color={colorTheme.redLight}
              shouldDelete={seconds > 141}
            />
          </Text>
        )}
        {seconds >= 143 && seconds < 153 && (
          <Text size="48px" style={{ lineHeight: "48px" }}>
            <TypingText
              // megv
              text={2016 + ""}
              color={colorTheme.redLight}
              shouldDelete={seconds > 151}
            />
          </Text>
        )}
        {seconds >= 153 && (
          <Text size="48px" style={{ lineHeight: "48px" }}>
            <TypingText
              //pana
              text={2018 + ""}
              color={colorTheme.redLight}
            />
          </Text>
        )}
      </Box>
      <Box flex={false} align="center" style={{ position: "relative" }}>
        <Text
          size="48px"
          weight="bold"
          style={{ userSelect: "none", lineHeight: "48px", opacity: 0 }}
        >
          Portland&#10240;State&#10240;University
        </Text>

        <Box
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: `translateX(-50%)`,
          }}
          width="100%"
          height="100%"
        >
          <Text size="48px" style={{ lineHeight: "48px" }}>
            {seconds <= 123 && <>&#10240;</>}
            {seconds > 123 && seconds < 130 && (
              <TypingText
                text={"Megaface launched"}
                color={colorTheme.offWhite}
                shouldDelete={seconds > 127}
              />
            )}
            {seconds > 131 && seconds < 139 && (
              <TypingText
                text={"Super Neuro"}
                typingRate={0.17}
                color={colorTheme.offWhite}
                shouldDelete={seconds >= 136}
              />
            )}
            {seconds > 138 && seconds < 144 && (
              <TypingText
                text={"Portland State University"}
                typingRate={0.06}
                color={colorTheme.offWhite}
                deleteRate={0.03}
                shouldDelete={seconds > 140}
              />
            )}
            {seconds >= 144 && seconds < 154 && (
              <TypingText
                text={"Megvii"}
                typingRate={0.17}
                color={colorTheme.offWhite}
                shouldDelete={seconds >= 151}
              />
            )}
            {seconds >= 155 && (
              <TypingText
                text={"Panasonic"}
                typingRate={0.17}
                color={colorTheme.offWhite}
              />
            )}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

const RollingText = ({
  yearShown,
  shouldDelete,
}: {
  yearShown: number;
  shouldDelete: boolean;
}) => {
  const targetTranslation = `translateY(${-(yearShown - 2015) * 20}%)`;
  return (
    <Box style={{ position: "relative", height: "48px", overflow: "hidden" }}>
      <Box
        flex={false}
        style={{
          transform: targetTranslation,
          transition: "transform 1.2s linear",
        }}
      >
        <Text
          size="48px"
          weight="bold"
          color={colorTheme.redLight}
          style={{ userSelect: "none", lineHeight: "48px" }}
        >
          <TypingText
            text={"2015"}
            color={colorTheme.redLight}
            shouldDelete={shouldDelete}
          />
        </Text>
        <Text
          size="48px"
          weight="bold"
          color={colorTheme.redLight}
          style={{ userSelect: "none", lineHeight: "48px" }}
        >
          <TypingText
            text={"2016"}
            color={colorTheme.redLight}
            shouldDelete={shouldDelete}
          />
        </Text>
        <Text
          size="48px"
          weight="bold"
          color={colorTheme.redLight}
          style={{ userSelect: "none", lineHeight: "48px" }}
        >
          <TypingText
            text={"2017"}
            color={colorTheme.redLight}
            shouldDelete={shouldDelete}
          />
        </Text>
        <Text
          size="48px"
          weight="bold"
          color={colorTheme.redLight}
          style={{ userSelect: "none", lineHeight: "48px" }}
        >
          <TypingText
            text={"2018"}
            color={colorTheme.redLight}
            shouldDelete={shouldDelete}
          />
        </Text>
        <Text
          size="48px"
          weight="bold"
          color={colorTheme.redLight}
          style={{ userSelect: "none", lineHeight: "48px" }}
        >
          <TypingText
            text={"2019"}
            color={colorTheme.redLight}
            shouldDelete={shouldDelete}
          />
        </Text>
      </Box>
    </Box>
  );
};

const TypingText = memo(
  ({
    text,
    color,
    shouldDelete = false,
    typingRate = 0.1,
    deleteRate = 0.05,
  }: {
    typingRate?: number;
    deleteRate?: number;
    text: string;
    color: string;
    shouldDelete?: boolean;
  }) => {
    const [charactersShown, setCharactersShown] = useState(0);

    const interval = useRef<NodeJS.Timeout>();
    useEffect(() => {
      if (shouldDelete) {
        if (interval.current) clearInterval(interval.current);
        interval.current = setInterval(
          () => setCharactersShown((character) => character - 1),
          deleteRate * 1000
        );
      } else {
        if (interval.current) clearInterval(interval.current);
        interval.current = setInterval(
          () => setCharactersShown((character) => character + 1),
          typingRate * 1000
        );
      }
      return () => {
        if (interval.current) clearInterval(interval.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldDelete]);

    useEffect(() => {
      if (charactersShown > text.length && !shouldDelete) {
        if (interval.current) clearInterval(interval.current);
        // Finished
      } else if (charactersShown <= 0 && shouldDelete) {
        if (interval.current) clearInterval(interval.current);
      } else {
        // Letter changed
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, charactersShown]);

    return (
      <Box
        direction="row"
        style={{ lineHeight: "48px", justifyContent: "center" }}
        color={color}
      >
        <Text
          size="48px"
          style={{
            lineHeight: "48px",
            userSelect: "none",
            textAlign: "center",
            color,
          }}
          weight="bold"
        >
          {[...text.slice(0, charactersShown)].map((char, index) =>
            char === " " ? <Fragment key={index}>&nbsp;</Fragment> : char
          )}
        </Text>
        <Text
          size="48px"
          style={{
            lineHeight: "48px",
            userSelect: "none",
            opacity: 0,
            textAlign: "center",
          }}
          weight="bold"
        >
          {[...text.slice(charactersShown, text.length)].map((char, index) =>
            char === " " ? <Fragment key={index}>&nbsp;</Fragment> : char
          )}
        </Text>
      </Box>
    );
  }
);
