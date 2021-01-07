import { Box, Button, Layer } from "grommet";
import { FastForward, Pause, Play, Rewind } from "grommet-icons";
import { ProgressIndicator } from "./ProgressIndicator";
import { RoutedButton } from "./RoutedAnchor";

export const ChapterButtons = ({
  chapterNumber,
}: {
  chapterNumber: number;
}) => {
  return (
    <Layer modal={false} position="bottom" responsive={false}>
      <Box direction="row" background="grey">
        <Button icon={<Play />} />
        <Button icon={<Pause />} />
        <RoutedButton
          icon={<FastForward />}
          href={`/cover${chapterNumber + 1}`}
        />
        <RoutedButton icon={<Rewind />} href={`/cover${chapterNumber - 1}`} />
        <ProgressIndicator />
      </Box>
    </Layer>
  );
};
