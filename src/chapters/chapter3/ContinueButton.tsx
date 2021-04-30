import { Box, ResponsiveContext } from "grommet";
import { useContext } from "react";
import { FinishedButton } from "../../components/FinishedButton";
import { useIsActive } from "../../hooks/useIsActive";

export function ContinueButton(props: {
  isAutoPaused: boolean;
  play?: () => void;
}) {
  const isSmall = useContext(ResponsiveContext) === "small";
  const isActive = useIsActive();

  return (
    <Box
      style={{
        position: "absolute",
        bottom: isSmall ? "48px" : "64px",
        right: 0,
      }}
    >
      {props.isAutoPaused && (
        <FinishedButton
          shouldProgress={!isActive}
          shouldShow={props.isAutoPaused}
          text="Continue"
          textWidth="200px"
          toProgress={props.play}
        />
      )}
    </Box>
  );
}
