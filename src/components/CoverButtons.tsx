import { Button, Footer } from "grommet";
import { Launch, Rewind } from "grommet-icons";
import { ProgressIndicator } from "./ProgressIndicator";

export const CoverButtons = ({ coverNumber }: { coverNumber: number }) => {
  return (
    <Footer direction="row">
      <Button icon={<Launch />} href={`/chapter${coverNumber}`} />
      <Button icon={<Rewind />} href={`/chapter${coverNumber - 1}`} />
      <ProgressIndicator />
    </Footer>
  );
};
