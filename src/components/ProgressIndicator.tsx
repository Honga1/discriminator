import { Box, Tip } from "grommet";
import { useHistory } from "react-router-dom";
import {
  numberToProgress,
  progressNameToHumanName,
  progressNumberToRoute,
  progressToNumber,
} from "../store/Progress";
import { useStore } from "../store/store";

export const ProgressIndicator = () => {
  const progress = useStore((state) => state.progress);
  const history = useHistory();

  const barElements = Object.values(progressToNumber).map((progressNumber) => {
    const isCurrentSection = progressNumber === progressToNumber[progress];
    const progressName = numberToProgress[progressNumber];
    const humanName = progressNameToHumanName[progressName];
    return (
      <Tip content={humanName} key={progressNumber}>
        <Box
          fill
          background={isCurrentSection ? "lightgrey" : "grey"}
          onClick={() => {
            history.push(progressNumberToRoute[progressNumber]);
          }}
        />
      </Tip>
    );
  });
  return (
    <Box
      fill="horizontal"
      background="lightgrey"
      height="10px"
      gap="xxsmall"
      direction="row"
      justify="evenly"
    >
      {barElements}
    </Box>
  );
};
