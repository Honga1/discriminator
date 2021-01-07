import { Box } from "grommet";
import { PropsWithChildren } from "react";
import { CoverButtons } from "./CoverButtons";

export const CoverContainer = ({
  children,
  coverNumber,
}: PropsWithChildren<{ coverNumber: number }>) => {
  return (
    <Box fill justify="center" alignContent="center">
      <CoverButtons coverNumber={coverNumber} />
      {children}
    </Box>
  );
};
