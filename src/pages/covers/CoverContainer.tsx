import { Box } from "grommet";
import { PropsWithChildren, useEffect } from "react";
import { CoverNumbers, coverNumberToProgress } from "../../store/Progress";
import { useStore } from "../../store/store";
import { CoverButtons } from "./CoverButtons";

export const CoverContainer = ({
  children,
  coverNumber,
}: PropsWithChildren<{ coverNumber: CoverNumbers }>) => {
  const setProgress = useStore((state) => state.setProgress);

  useEffect(() => {
    setProgress(coverNumberToProgress[coverNumber]);
  }, [coverNumber, setProgress]);

  return (
    <Box fill justify="center" alignContent="center">
      <CoverButtons coverNumber={coverNumber} />
      {children}
    </Box>
  );
};
