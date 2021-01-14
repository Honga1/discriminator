import { Box, Button, Layer } from "grommet";
import { FastForward, Pause, Play, Rewind } from "grommet-icons";
import { ProgressIndicator } from "../../components/ProgressIndicator";
import { RoutedButton } from "../../components/RoutedAnchor";
import { chapterFlow, ChapterNumbers } from "../../Routes";

export const ChapterButtons = ({
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
        <Button icon={<Play />} />
        <Button icon={<Pause />} />
        <RoutedButton icon={<FastForward />} href={chapterFlow[url].next} />
        <RoutedButton icon={<Rewind />} href={chapterFlow[url].previous} />
      </Box>
      <ProgressIndicator />
    </Layer>
  );
};
