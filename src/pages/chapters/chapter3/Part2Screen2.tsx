import { Box, ResponsiveContext, Text } from "grommet";
import { useContext, useEffect, useState } from "react";
import { CustomScrollbarBox } from "../../../components/CustomScrollbarBox";
import { useSimulatedTypingTimer } from "../../../hooks/useSimulatedTypingTimer";
import { colorTheme } from "../../../theme";

export const Part2Screen2 = () => {
  const isSmall = useContext(ResponsiveContext) === "small";

  const [currentRow, setCurrentRow] = useState<
    2015 | 2016 | 2017 | 2018 | 2019 | "DONE"
  >(2015);

  return (
    <Box flex={false} height="100%" width="100%" pad="4px">
      <CustomScrollbarBox
        flex={false}
        height="100%"
        width="100%"
        overflow="auto"
        pad={"8px"}
      >
        <TextRow
          year={2015}
          downloads={7}
          entries={["MegaFace launched", "||||||||||| Super Neuro"]}
          shouldType={currentRow === 2015}
          onFinished={() => setCurrentRow(2016)}
        ></TextRow>
        <TextRow
          year={2016}
          downloads={266}
          entries={[
            "||||||||||| Portland State University, Portland, United States",
            "||||||||||| Megvii, City city, China",
          ]}
          shouldType={currentRow === 2016}
          onFinished={() => setCurrentRow(2017)}
        ></TextRow>
        <TextRow
          year={2017}
          downloads={365}
          entries={["||||||||||| AliBaba, City city, China"]}
          shouldType={currentRow === 2017}
          onFinished={() => setCurrentRow(2018)}
        ></TextRow>
        <TextRow
          year={2018}
          downloads={411}
          entries={[
            "||||||||||| AliBaba, City city, China",
            "||||||||||| ByteDance, City city, China",
            "||||||||||| Panasonic, City city, United States",
          ]}
          shouldType={currentRow === 2018}
          onFinished={() => setCurrentRow(2019)}
        ></TextRow>
        <TextRow
          year={2019}
          downloads={366}
          entries={[
            "||||||||||| Google, Mountain View, United States",
            "||||||||||| AliBaba, City city, China",
          ]}
          shouldType={currentRow === 2019}
          onFinished={() => setCurrentRow("DONE")}
        ></TextRow>
        <TextRow
          year={2019}
          downloads={366}
          entries={[
            "||||||||||| Google, Mountain View, United States",
            "||||||||||| AliBaba, City city, China",
          ]}
          shouldType={currentRow === 2019}
          onFinished={() => setCurrentRow("DONE")}
        ></TextRow>
        <TextRow
          year={2019}
          downloads={366}
          entries={[
            "||||||||||| Google, Mountain View, United States",
            "||||||||||| AliBaba, City city, China",
          ]}
          shouldType={currentRow === 2019}
          onFinished={() => setCurrentRow("DONE")}
        ></TextRow>
        <TextRow
          year={2019}
          downloads={366}
          entries={[
            "||||||||||| Google, Mountain View, United States",
            "||||||||||| AliBaba, City city, China",
          ]}
          shouldType={currentRow === 2019}
          onFinished={() => setCurrentRow("DONE")}
        ></TextRow>
        <TextRow
          year={2019}
          downloads={366}
          entries={[
            "||||||||||| Google, Mountain View, United States",
            "||||||||||| AliBaba, City city, China",
          ]}
          shouldType={currentRow === 2019}
          onFinished={() => setCurrentRow("DONE")}
        ></TextRow>
      </CustomScrollbarBox>
    </Box>
  );
};

function TextRow({
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
}) {
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

  return (
    <Text>
      <Text
        weight={"bold"}
        color={"redLight"}
        size="24px"
        style={{
          lineHeight: "72px",
        }}
      >
        {year}
      </Text>
      &nbsp;&nbsp;
      {entries.map((entry, entryNumber) => {
        const charactersUntilThisPoint = entries
          .slice(0, entryNumber)
          .flatMap((entry) => [...entry]).length;

        const shouldShowCharacters = Math.max(
          0,
          stroke - charactersUntilThisPoint
        );

        const characters = [...entry];
        const shownCharacters = characters.slice(0, shouldShowCharacters);
        const hiddenCharacters = characters.slice(
          shouldShowCharacters,
          characters.length
        );

        return (
          <Text
            size="24px"
            color="offWhite"
            style={{
              lineHeight: "72px",
            }}
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
      })}
      &nbsp;&nbsp;
      <Text
        size="24px"
        color="yellow"
        style={{
          lineHeight: "72px",
          textDecoration: "underline",
        }}
      >
        {downloads}&nbsp;more&nbsp;downloads
      </Text>
    </Text>
  );
}
