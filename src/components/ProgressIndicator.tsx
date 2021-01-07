import { Box, RangeInput, Text } from "grommet";

export const ProgressIndicator = () => {
  return (
    <Box direction="row">
      <Text>Progress</Text>
      <RangeInput min={0} max={1} step={0.01} />
    </Box>
  );
};
