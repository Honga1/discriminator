import { Button, Footer } from "grommet";
import { FastForward, Pause, Play, Rewind } from "grommet-icons";
import { ProgressIndicator } from "./ProgressIndicator";

export const ChapterButtons = ({
  chapterNumber,
}: {
  chapterNumber: number;
}) => {
  return (
    <Footer direction="row">
      <Button icon={<Play />} />
      <Button icon={<Pause />} />
      <Button icon={<FastForward />} href={`/cover${chapterNumber + 1}`} />
      <Button icon={<Rewind />} href={`/cover${chapterNumber - 1}`} />
      <ProgressIndicator />
    </Footer>
  );
};
