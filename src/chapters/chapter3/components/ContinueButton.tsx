import { Box, ResponsiveContext } from "grommet";
import { useContext } from "react";
import { FinishedButton } from "src/components/FinishedButton";

export function ContinueButton(props: {
  isAutoPaused: boolean;
  play?: () => void;
}) {
  const isSmall = useContext(ResponsiveContext) === "small";

  return (
    <Box
      style={{
        position: "absolute",
        top: isSmall ? "69%" : "77%",
        right: 0,
      }}
    >
      {props.isAutoPaused && (
        <FinishedButton
          shouldProgress={false}
          shouldShow={props.isAutoPaused}
          text="Continue"
          textWidth="200px"
          toProgress={() => props.play?.()}
          expanded={"auto"}
        />
      )}
    </Box>
  );
}
