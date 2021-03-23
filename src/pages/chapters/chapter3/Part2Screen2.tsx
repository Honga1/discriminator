import { Box, ResponsiveContext, Text } from "grommet";
import { useContext } from "react";

function TextRow({
  year,
  entries,
  downloads,
}: {
  year: number;
  entries: string[];
  downloads: number;
}) {
  return (
    <Box direction="row" flex={false}>
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

      <Text
        size="24px"
        color="offWhite"
        style={{
          lineHeight: "72px",
        }}
      >
        &nbsp;&nbsp;
        {entries.map((entry) => {
          if (entry === "") {
            return <>&nbsp;&nbsp;–––––––––––&nbsp;&nbsp;•••</>;
          } else {
            return <>&nbsp;&nbsp;{entry}&nbsp;&nbsp;•••</>;
          }
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
          {downloads} more downloads
        </Text>
      </Text>
    </Box>
  );
}

export const Part2Screen2 = () => {
  const isSmall = useContext(ResponsiveContext) === "small";

  return (
    <Box flex={false} height="100%" width="100%" pad={"12px"}>
      <TextRow
        year={2015}
        downloads={7}
        entries={["MegaFace launched", ""]}
      ></TextRow>
      <TextRow year={2016} downloads={266} entries={["", ""]}></TextRow>
      <TextRow year={2017} downloads={365} entries={["", "", "", ""]}></TextRow>
      <TextRow
        year={2018}
        downloads={411}
        entries={["", "", "", "", "", ""]}
      ></TextRow>
      <TextRow
        year={2019}
        downloads={366}
        entries={["", "", "", "", "", "", ""]}
      ></TextRow>
    </Box>
  );
};
