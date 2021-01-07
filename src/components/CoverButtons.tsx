import { Box, Layer } from "grommet";
import { Launch, Rewind } from "grommet-icons";
import { ProgressIndicator } from "./ProgressIndicator";
import { RoutedButton } from "./RoutedAnchor";

export const CoverButtons = ({ coverNumber }: { coverNumber: number }) => {
  return (
    <Layer modal={false} position="bottom" responsive={false}>
      <Box direction="row" background="grey">
        <RoutedButton icon={<Launch />} href={`/chapter${coverNumber}`} />
        <RoutedButton icon={<Rewind />} href={`/chapter${coverNumber - 1}`} />
        <ProgressIndicator />
      </Box>
    </Layer>
  );
};
