import { Box, Button, Layer } from "grommet";
import { FastForward, Pause, Play, Rewind } from "grommet-icons";
import { ProgressIndicator } from "./ProgressIndicator";

export const ChapterButtons = ({
  chapterNumber,
}: {
  chapterNumber: number;
}) => {
  return (
    <Layer modal={false} position="bottom">
      <Box direction="row" background="lightgrey">
        <Button icon={<Play />} />
        <Button icon={<Pause />} />
        <Button icon={<FastForward />} href={`/cover${chapterNumber + 1}`} />
        <Button icon={<Rewind />} href={`/cover${chapterNumber - 1}`} />
        <ProgressIndicator />
      </Box>
    </Layer>
  );
};
