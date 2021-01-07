import { Anchor, Nav } from "grommet";
import { ProgressIndicator } from "./ProgressIndicator";

export const CoverButtons = ({ coverNumber }: { coverNumber: number }) => {
  return (
    <Nav direction="row" background="brand">
      <Anchor label="enter" href={`/chapter${coverNumber}`} />
      <Anchor label="back" href={`/chapter${coverNumber - 1}`} />
      <ProgressIndicator />
    </Nav>
  );
};
