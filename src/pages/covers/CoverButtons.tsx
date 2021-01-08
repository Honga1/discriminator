import { Box, Layer } from "grommet";
import { Launch, Rewind } from "grommet-icons";
import { ProgressIndicator } from "../../components/ProgressIndicator";
import { RoutedButton } from "../../components/RoutedAnchor";

export const CoverButtons = ({ coverNumber }: { coverNumber: number }) => {
  return (
    <Layer full="horizontal" modal={false} position="bottom" responsive={false}>
      <Box
        alignSelf="center"
        direction="row"
        background="grey"
        margin={{ bottom: "small" }}
      >
        <RoutedButton icon={<Launch />} href={`/chapter${coverNumber}`} />
        <RoutedButton icon={<Rewind />} href={`/chapter${coverNumber - 1}`} />
      </Box>
      <ProgressIndicator />
    </Layer>
  );
};
