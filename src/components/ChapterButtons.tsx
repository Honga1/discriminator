import { Nav, Button, Anchor } from "grommet";
import { ProgressIndicator } from "./ProgressIndicator";

export const ChapterButtons = ({
  chapterNumber,
}: {
  chapterNumber: number;
}) => {
  return (
    <Nav direction="row" background="brand">
      <Button label="play" />
      <Button label="pause" />
      <Anchor label="next" href={`/cover${chapterNumber + 1}`} />
      <Anchor label="back" href={`/cover${chapterNumber - 1}`} />
      <ProgressIndicator />
    </Nav>
  );
};
