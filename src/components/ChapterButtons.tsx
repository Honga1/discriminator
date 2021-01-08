import { Box, Button, Layer } from "grommet";
import { FastForward, Pause, Play, Rewind } from "grommet-icons";
import { ChapterNumbers } from "../store/Progress";
import { ProgressIndicator } from "./ProgressIndicator";
import { RoutedButton } from "./RoutedAnchor";

export const ChapterButtons = ({
  chapterNumber,
}: {
  chapterNumber: ChapterNumbers;
}) => {
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
        <RoutedButton
          icon={<FastForward />}
          href={`/cover${chapterNumber + 1}`}
        />
        <RoutedButton icon={<Rewind />} href={`/cover${chapterNumber - 1}`} />
      </Box>
      <ProgressIndicator />
    </Layer>
  );
};
