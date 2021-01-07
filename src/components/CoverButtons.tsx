import { Box, Button, Layer } from "grommet";
import { Launch, Rewind } from "grommet-icons";
import { ProgressIndicator } from "./ProgressIndicator";

export const CoverButtons = ({ coverNumber }: { coverNumber: number }) => {
  return (
    <Layer modal={false} position="bottom">
      <Box direction="row" background="lightgrey">
        <Button icon={<Launch />} href={`/chapter${coverNumber}`} />
        <Button icon={<Rewind />} href={`/chapter${coverNumber - 1}`} />
        <ProgressIndicator />
      </Box>
    </Layer>
  );
};
