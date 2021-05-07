import { Box, ResponsiveContext } from "grommet";
import { useContext } from "react";
import { FinishedButton } from "src/components/FinishedButton";
import { useStore } from "src/store/store";

export function ContinueButton(props: {
  isAutoPaused: boolean;
  play?: () => void;
}) {
  const isSmall = useContext(ResponsiveContext) === "small";
  const isActive = useStore((state) => state.isActive);

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
          shouldProgress={!isActive}
          shouldShow={props.isAutoPaused}
          text="Continue"
          textWidth="200px"
          toProgress={() => props.play?.()}
        />
      )}
    </Box>
  );
}
