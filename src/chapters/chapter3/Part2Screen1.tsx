import { Box, Grid, ResponsiveContext } from "grommet";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { animated, useSpring } from "react-spring";
import { AdamFaceCircle } from "src/components/FaceCircles";
import styled from "styled-components";

export const Part2Screen1 = () => {
  const isSmall = useContext(ResponsiveContext) === "small";

  const [style] = useSpring(() => ({
    from: { transform: `scale(0.8)` },
    to: { transform: `scale(100)` },
    config: { duration: 20000, easing: (t) => t * t * t },
  }));

  return (
    <Box
      height="100%"
      width="100%"
      style={{ position: "relative", zIndex: 0, overflow: "hidden" }}
    >
      <AnimatedBox
        height="100%"
        width="100%"
        justify="center"
        pad="48px"
        style={{ ...style, overflow: "hidden" }}
      >
        {isSmall ? (
          <Grid
            fill
            areas={[
              { name: "top", start: [0, 0], end: [0, 0] },
              { name: "middle", start: [0, 1], end: [0, 1] },
              { name: "bottom", start: [0, 2], end: [0, 2] },
            ]}
            columns={["flex"]}
            rows={["1/4", "auto", "1/4"]}
            gap="32px"
            pad={{ horizontal: "16px", vertical: "32px" }}
          >
            <Box gridArea="middle" justify="center" align="center">
              <AdamFaceCircle isTalking={true} />
            </Box>
          </Grid>
        ) : (
          <Grid
            fill
            areas={[
              { name: "left-text", start: [0, 0], end: [0, 0] },
              { name: "left-center", start: [0, 1], end: [0, 1] },
              { name: "center", start: [1, 1], end: [1, 1] },
              { name: "right-center", start: [2, 1], end: [2, 1] },
              { name: "right-text", start: [2, 2], end: [2, 2] },
            ]}
            columns={["flex", "flex", "flex"]}
            rows={["96px", "flex", "96px"]}
            gap="48px"
          >
            <Box gridArea="center" justify="center" align="center">
              <AdamFaceCircle isTalking={true} />
            </Box>
          </Grid>
        )}
      </AnimatedBox>
      <RainDrops />
    </Box>
  );
};

const AnimatedBox = animated(Box);

const StyledRainDrop = styled.div`
  & {
    position: absolute;
    animation-name: ChangeHeight;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: normal;
    transform: scale(0.8) translate(-50%, -100%);
  }

  @keyframes ChangeHeight {
    from {
      transform: scale(0.8) translate(-50%, -100%);
    }

    to {
      transform: scale(1.2) translate(-50%, 100vh);
    }
  }
`;

const RainDrop = () => {
  const distanceFactor = 1 - Math.random() / 3;
  const size = distanceFactor * 32;
  return (
    <StyledRainDrop
      style={{
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: Math.random() * 2 + "s",
        left: Math.random() * 100 + "%",
        opacity: distanceFactor,
        animationDuration: (1 / distanceFactor) * 2 + "s",
        // zIndex: distanceFactor > 0.9 ? 0 : -1,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7 17L16 27L25 17L21 17L21 7L11 7L11 17L7 17Z"
          fill="#F8F9FA"
        />
      </svg>
    </StyledRainDrop>
  );
};

const RainDrops = memo(() => {
  const amount = useRef(1);
  const [drops, setDrops] = useState<JSX.Element[]>([]);
  useEffect(() => {
    amount.current = 1;
    const interval = setInterval(() => {
      amount.current *= 1.03;
      setDrops((drops) => {
        const dropsNext = Math.min(50, Math.floor(amount.current));
        if (drops.length < dropsNext) {
          const addDrops = Math.abs(dropsNext - drops.length);
          return [
            ...drops,
            ...Array.from({ length: addDrops }).map((_, index) => {
              console.log(drops.length + index + 1);
              return <RainDrop key={drops.length + index} />;
            }),
          ];
        } else {
          return drops;
        }
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Box
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        //,
      }}
      justify="center"
    >
      <Box
        width="100%"
        height="100%"
        style={{
          position: "relative",
        }}
        overflow="hidden"
      >
        {drops}
      </Box>
    </Box>
  );
});
