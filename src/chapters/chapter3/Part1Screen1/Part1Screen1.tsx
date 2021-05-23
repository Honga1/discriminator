import { Box, Grid, ResponsiveContext, Text } from "grommet";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import { AdamFaceCircle, BrettFaceCircle } from "../components/FaceCircles";
import { Spectrogram } from "./components/Spectrogram";
import { TypingText } from "./components/TypingText";

export const Part1Screen1 = memo(({ seconds }: { seconds: number }) => {
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

  const isTypingTextStarted = seconds >= 24;
  const shouldBrettSayYep = seconds > 29;

  return (
    <Box height="100%" width="100%" justify="center" pad="48px">
      {isSmall ? (
        <SmallLayout personTalking={personTalking} />
      ) : (
        <NormalLayout
          personTalking={personTalking}
          isTypingTextStarted={isTypingTextStarted}
          shouldBrettSayYep={shouldBrettSayYep}
        />
      )}
    </Box>
  );
});

Part1Screen1.displayName = "Part1Screen1";

const SmallLayout = memo(({ personTalking }: { personTalking: string }) => {
  return (
    <Grid
      fill
      areas={[
        {
          name: "brett",
          start: [0, 0],
          end: [0, 0],
        },
        {
          name: "spectrogram",
          start: [0, 1],
          end: [0, 1],
        },
        {
          name: "adam",
          start: [0, 2],
          end: [0, 2],
        },
      ]}
      columns={["flex"]}
      rows={["flex", "1/4", "flex"]}
      gap="32px"
      pad={{
        horizontal: "16px",
        vertical: "32px",
      }}
    >
      <Box gridArea="brett" justify="center" align="center">
        <BrettFaceCircle isTalking={personTalking === "BRETT"} />
      </Box>
      <Box gridArea="spectrogram" justify="center" align="center">
        <Spectrogram />
      </Box>
      <Box gridArea="adam" justify="center" align="center">
        <AdamFaceCircle isTalking={personTalking === "ADAM"} />
      </Box>
    </Grid>
  );
});

SmallLayout.displayName = "SmallLayout";

const NormalLayout = memo(
  (props: {
    shouldBrettSayYep: boolean;
    personTalking: string;
    isTypingTextStarted: boolean;
  }) => {
    return (
      <Grid
        fill
        areas={[
          {
            name: "brett-text",
            start: [0, 0],
            end: [0, 0],
          },
          {
            name: "brett",
            start: [0, 1],
            end: [0, 1],
          },
          {
            name: "spectrogram",
            start: [1, 1],
            end: [1, 1],
          },
          {
            name: "adam",
            start: [2, 1],
            end: [2, 1],
          },
          {
            name: "adam-text",
            start: [2, 2],
            end: [2, 2],
          },
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
              opacity: props.shouldBrettSayYep ? 1 : 0,
              transitionDelay: "0.18s",
            }}
          >
            Yep.
          </Text>
        </Box>
        <Box gridArea="brett" justify="center" align="center">
          <BrettFaceCircle isTalking={props.personTalking === "BRETT"} />
        </Box>
        <Box gridArea="spectrogram" justify="center" align="center">
          <Spectrogram />
        </Box>
        <Box gridArea="adam" justify="center" align="center">
          <AdamFaceCircle isTalking={props.personTalking === "ADAM"} />
        </Box>
        <Box gridArea="adam-text" justify="start" align="center">
          <TypingText isStarted={props.isTypingTextStarted} />
        </Box>
      </Grid>
    );
  }
);

NormalLayout.displayName = "NormalLayout";
