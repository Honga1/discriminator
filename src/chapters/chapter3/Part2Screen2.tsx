import { Box, ResponsiveContext, Text } from "grommet";
import { useContext, useEffect, useMemo, useState } from "react";
import { CustomScrollbarBox } from "../../components/CustomScrollbarBox";
import { useSimulatedTypingTimer } from "../../hooks/useSimulatedTypingTimer";
import { colorTheme } from "../../theme";

export const Part2Screen2 = () => {
  const isSmall = useContext(ResponsiveContext) === "small";

  const [currentRow, setCurrentRow] = useState<
    2015 | 2016 | 2017 | 2018 | 2019 | "DONE"
  >(2015);

  const textRows = useMemo(
    () =>
      data.map(({ year, downloads, entries }) => {
        return (
          <TextRow
            key={year}
            year={year}
            downloads={downloads}
            entries={entries}
            shouldType={currentRow === year}
            onFinished={() => {
              if (year === 2019) {
                setCurrentRow("DONE");
              } else {
                setCurrentRow((year + 1) as 2015 | 2016 | 2017 | 2018 | 2019);
              }
            }}
          />
        );
      }),
    [currentRow]
  );

  return (
    <Box flex={false} height="100%" width="100%" pad="4px">
      {isSmall ? (
        <Box
          flex={false}
          height="100%"
          width="100%"
          overflow="auto"
          pad={"8px"}
        >
          {textRows}
        </Box>
      ) : (
        <CustomScrollbarBox
          flex={false}
          height="100%"
          width="100%"
          overflow="auto"
          pad={"8px"}
        >
          {textRows}
        </CustomScrollbarBox>
      )}
    </Box>
  );
};

const TextRow = ({
  year,
  entries,
  downloads,
  shouldType,
  onFinished,
}: {
  year: number;
  entries: string[];
  downloads: number;
  shouldType: boolean;
  onFinished: () => void;
}) => {
  const [stroke, , stop, start] = useSimulatedTypingTimer({
    initialTime: 0,
  });

  useEffect(() => {
    if (stroke === entries.flatMap((entry) => [...entry]).length + 1) {
      onFinished();
    }
  }, [entries, onFinished, stroke]);

  useEffect(() => {
    if (!shouldType) {
      stop();
    } else {
      start();
    }
  }, [shouldType, start, stop]);

  const isSmall = useContext(ResponsiveContext) === "small";

  const text = entries.map((entry, entryNumber) => {
    const charactersUntilThisPoint = entries
      .slice(0, entryNumber)
      .flatMap((entry) => [...entry]).length;

    const shouldShowCharacters = Math.max(0, stroke - charactersUntilThisPoint);

    const characters = [...entry];
    const shownCharacters = characters.slice(0, shouldShowCharacters);
    const hiddenCharacters = characters.slice(
      shouldShowCharacters,
      characters.length
    );

    return (
      <Text
        color="offWhite"
        size={isSmall ? "20px" : "24px"}
        style={{ lineHeight: isSmall ? "40px" : "72px" }}
        key={entryNumber}
      >
        &nbsp;&nbsp;{shownCharacters.join("")}
        <span
          style={{
            color: colorTheme.offWhite,
            textDecoration: "line-through",
          }}
        >
          <span style={{ color: `rgba(0, 0, 0, 0)` }}>
            {hiddenCharacters.join("")}
          </span>
        </span>
        &nbsp;&nbsp;&nbsp;•••
      </Text>
    );
  });
  return (
    <Text>
      <Text
        weight={"bold"}
        color={"redLight"}
        size={isSmall ? "20px" : "24px"}
        style={{ lineHeight: isSmall ? "40px" : "72px" }}
      >
        {year}
      </Text>
      &nbsp;&nbsp;
      {text}
      &nbsp;&nbsp;
      <Text
        color="yellow"
        size={isSmall ? "20px" : "24px"}
        style={
          isSmall
            ? {
                lineHeight: "40px",
              }
            : {
                lineHeight: "72px",
                textDecoration: "underline",
              }
        }
      >
        {downloads}&nbsp;more&nbsp;downloads
      </Text>
    </Text>
  );
};

const data = [
  {
    year: 2015,
    downloads: 7,
    entries: ["MegaFace launched", "||||||||||| Super Neuro"],
  },
  {
    year: 2016,
    downloads: 266,
    entries: [
      "||||||||||| Portland State University, Portland, United States",
      "||||||||||| Megvii, City city, China",
    ],
  },
  {
    year: 2017,
    downloads: 365,
    entries: ["||||||||||| AliBaba, City city, China"],
  },
  {
    year: 2018,
    downloads: 411,
    entries: [
      "||||||||||| AliBaba, City city, China",
      "||||||||||| ByteDance, City city, China",
      "||||||||||| Panasonic, City city, United States",
    ],
  },
  {
    year: 2019,
    downloads: 366,
    entries: [
      "||||||||||| Google, Mountain View, United States",
      "||||||||||| AliBaba, City city, China",
    ],
  },
];
