import { Box, Grid, ResponsiveContext, Text } from "grommet";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { animated, config, to, useSpring } from "react-spring";
import { useAnimationFrame } from "src/hooks/useAnimationFrame";
import { colorTheme } from "src/theme";
import { SquareDiv } from "../../../components/SquareDiv";
import blinking from "./blinking.mp4";
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

const AdamFaceCircle = ({ isTalking }: { isTalking: boolean }) => {
  const [styles] = useSpring(
    {
      loop: isTalking,
      to: [
        {
          scale: 1.0,
        },
        {
          scale: 0.98,
        },
      ],
      from: { scale: 0.98 },
    },
    [isTalking]
  );

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <animated.div style={{ width: "100%", height: "100%", ...styles }}>
        <SquareDiv
          style={{
            background: "#312DFF",
            borderRadius: "50%",
          }}
        />
      </animated.div>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SquareDiv
          maxWidth="80%"
          maxHeight="80%"
          style={{
            overflow: "clip",
            borderRadius: "50%",
            background: "#202122",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 230 230"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M130.36 131.332H98.7881L91.6973 151H81.4492L110.227 75.6406H118.922L147.751 151H137.555L130.36 131.332ZM101.79 123.154H127.41L114.574 87.9072L101.79 123.154Z"
              fill="#F8F9FA"
            />
          </svg>
        </SquareDiv>
      </div>
    </div>
  );
};

const BrettFaceCircle = ({ isTalking }: { isTalking: boolean }) => {
  const [styles] = useSpring(
    {
      loop: isTalking,
      to: [
        {
          scale: 1.0,
        },
        {
          scale: 0.98,
        },
      ],
      from: { scale: 0.98 },
    },
    [isTalking]
  );

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <animated.div style={{ width: "100%", height: "100%", ...styles }}>
        <SquareDiv
          style={{
            borderRadius: "50%",
            background: "#168500",
          }}
        />
      </animated.div>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SquareDiv
          maxWidth="80%"
          maxHeight="80%"
          style={{
            overflow: "clip",
            borderRadius: "50%",
          }}
        >
          <video
            width="100%"
            controls={false}
            muted
            autoPlay
            loop
            style={{
              transform: `scale(2) translate(10%, 25%)`,
            }}
          >
            <source src={blinking} type="video/mp4" />
          </video>
        </SquareDiv>
      </div>
    </div>
  );
};

const numBars = 48;
const randomHeightScales = Array.from({ length: numBars }).map(
  () => 1 + (Math.random() - 0.5) / 5
);
const Spectrogram = memo(
  ({ getByteData }: { getByteData: () => Uint8Array }) => {
    const heightFactor = 390 / numBars;
    const rects = useRef<(SVGRectElement | null)[]>(
      Array.from({ length: numBars })
    );
    const ref = useRef<SVGSVGElement>(null);

    useAnimationFrame(20, () => {
      const data = getByteData();

      let min = Infinity;
      let max = -Infinity;

      data.forEach((datum) => {
        min = Math.min(min, datum);
        max = Math.max(max, datum);
      });

      const range = 64;

      for (let index = 0; index < rects.current.length; index++) {
        const scale = Math.min(
          (data[index]! - min) / range + 0.2 * randomHeightScales[index]!,
          1.0
        );
        const rect = rects.current[index];
        rect?.setAttribute(
          `transform`,
          `matrix(1, 0, 0, ${scale}, ${heightFactor * index}, 0)`
        );
      }
    });

    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 390 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
      >
        {rects.current.map((value, index) => {
          return (
            <rect
              ref={(ref) => (rects.current[index] = ref)}
              fill="#E8C100"
              key={index}
              width={3}
              height={101}
              transform={`matrix(1, 0, 0, 1, ${heightFactor * index}, 0)`}
              style={{ transformOrigin: "left center" }}
            />
          );
        })}
      </svg>
    );
  }
);
