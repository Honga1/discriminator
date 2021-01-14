import { Box, Layer } from "grommet";
import { Launch, Rewind } from "grommet-icons";
import { ProgressIndicator } from "../../components/ProgressIndicator";
import { RoutedButton } from "../../components/RoutedAnchor";
import { chapterFlow, ChapterNumbers } from "../../Routes";

export const CoverButtons = ({
  chapterNumber,
}: {
  chapterNumber: ChapterNumbers;
}) => {
  const url = `/chapter/${chapterNumber}?isChapter` as const;

  return (
    <Layer full="horizontal" modal={false} position="bottom" responsive={false}>
      <Box
        alignSelf="center"
        direction="row"
        background="grey"
        margin={{ bottom: "small" }}
      >
        <RoutedButton icon={<Launch />} href={chapterFlow[url].next} />
        <RoutedButton icon={<Rewind />} href={chapterFlow[url].previous} />
      </Box>
      <ProgressIndicator />
    </Layer>
  );
};
