import { Box, Grid, ResponsiveContext, Text } from "grommet";
import { useContext, useEffect, useState } from "react";
import {
  BrettFaceCircle,
  AdamFaceCircle,
} from "../../../components/FaceCircles";
import { Spectrogram } from "./Spectrogram";
import { TypingText } from "./TypingText";

export const Part1Screen1 = ({
  getByteData,
  seconds,
}: {
  getByteData: () => Uint8Array;
  seconds: number;
}) => {
  const isSmall = useContext(ResponsiveContext) === "small";

  const [personTalking, setPersonTalking] = useState<"ADAM" | "BRETT">("BRETT");

  useEffect(() => {
    if (seconds < 22) {
      setPersonTalking("BRETT");
    } else if (seconds < 29) {
      setPersonTalking("ADAM");
    } else {
      setPersonTalking("BRETT");
    }
  }, [seconds]);

  const NormalLayout = (
    <Grid
      fill
      areas={[
        { name: "brett-text", start: [0, 0], end: [0, 0] },
        { name: "brett", start: [0, 1], end: [0, 1] },
        { name: "spectrogram", start: [1, 1], end: [1, 1] },
        { name: "adam", start: [2, 1], end: [2, 1] },
        { name: "adam-text", start: [2, 2], end: [2, 2] },
      ]}
      columns={["flex", "flex", "flex"]}
      rows={["96px", "flex", "96px"]}
      gap="48px"
    >
      <Box gridArea="brett-text" justify="end" align="center">
        <Text
          textAlign="start"
          size={"48px"}
          style={{
            lineHeight: "48px",
            transition: "opacity 0.1s ease-in-out",
            opacity: seconds > 29 ? 1 : 0,
            transitionDelay: "0.18s",
          }}
        >
          Yep.
        </Text>
      </Box>
      <Box gridArea="brett" justify="center" align="center">
        <BrettFaceCircle isTalking={personTalking === "BRETT"} />
      </Box>
      <Box gridArea="spectrogram" justify="center" align="center">
        <Spectrogram getByteData={getByteData} />
      </Box>
      <Box gridArea="adam" justify="center" align="center">
        <AdamFaceCircle isTalking={personTalking === "ADAM"} />
      </Box>
      <Box gridArea="adam-text" justify="start" align="center">
        <TypingText isStarted={seconds >= 24} />
      </Box>
    </Grid>
  );

  const SmallLayout = (
    <Grid
      fill
      areas={[
        { name: "brett", start: [0, 0], end: [0, 0] },
        { name: "spectrogram", start: [0, 1], end: [0, 1] },
        { name: "adam", start: [0, 2], end: [0, 2] },
      ]}
      columns={["flex"]}
      rows={["flex", "1/4", "flex"]}
      gap="32px"
      pad={{ horizontal: "16px", vertical: "32px" }}
    >
      <Box gridArea="brett" justify="center" align="center">
        <BrettFaceCircle isTalking={personTalking === "BRETT"} />
      </Box>
      <Box gridArea="spectrogram" justify="center" align="center">
        <Spectrogram getByteData={getByteData} />
      </Box>
      <Box gridArea="adam" justify="center" align="center">
        <AdamFaceCircle isTalking={personTalking === "ADAM"} />
      </Box>
    </Grid>
  );

  return (
    <Box height="100%" width="100%" justify="center" pad="48px">
      {isSmall ? SmallLayout : NormalLayout}
    </Box>
  );
};
