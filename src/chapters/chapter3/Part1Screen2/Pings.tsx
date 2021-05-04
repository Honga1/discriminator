import { Box } from "grommet";
import { useEffect, useRef, useState } from "react";
import { animated, useTransition } from "react-spring";
import { colorTheme } from "src/theme";
import styled from "styled-components";

export function Pings() {
  const [pings, setPings] = useState<{ x: string; y: string; key: number }[]>(
    []
  );
  const count = useRef(0);

  useEffect(() => {
    const x = Math.random() * 100 + "%";
    const y = Math.random() * 100 + "%";
    setPings((pings) => {
      return [
        {
          x,
          y,
          key: count.current + 1,
        },
        ...pings.slice(0, 2),
      ];
    });

    const timeout = setInterval(async () => {
      await delay(Math.random() * 3000);

      const x = Math.random() * 100 + "%";
      const y = Math.random() * 100 + "%";
      setPings((pings) => {
        return [
          {
            x,
            y,
            key: count.current + 1,
          },
          ...pings.slice(0, 2),
        ];
      });
      count.current = count.current + 1;
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  const transition = useTransition(pings, {
    keys: (item) => item.key,
    from: { opacity: 0, transform: `scale${0.6}` },
    enter: { opacity: 1, transform: `scale${1}` },
    leave: { opacity: 0, transform: `scale${0.6}` },
  });
  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        zIndex: 2,
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <Box
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {transition((style, item) => {
          return (
            <animated.div
              key={item.key}
              style={{
                position: "absolute",
                top: item.x,
                left: item.y,
                opacity: style.opacity,
                width: "45px",
                height: "45px",
              }}
            >
              <AnimatedBox
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transform: style.transform,
                }}
              >
                <PulsingCircle delay={0}></PulsingCircle>
                <PulsingCircle delay={1 / 2}></PulsingCircle>
                <PulsingCircle delay={2 / 2}></PulsingCircle>
                <PulsingCircle delay={3 / 2}></PulsingCircle>
              </AnimatedBox>
            </animated.div>
          );
        })}
      </Box>
    </Box>
  );
}
const AnimatedBox = animated(Box);
const PulsingCircle = styled(Box)<{ delay: number }>`
  border-radius: 50%;
  animation: scaleIn 2s cubic-bezier(0.36, 0.11, 0.89, 0.32);
  position: absolute;
  border: 2px solid ${colorTheme.offWhite};
  width: 100%;
  height: 100%;
  animation-delay: ${(props) => props.delay}s;
  opacity: 0;

  @keyframes scaleIn {
    from {
      transform: scale(0.5, 0.5);
      opacity: 0.5;
    }
    to {
      transform: scale(2, 2);
      opacity: 0;
    }
  }
`;
function delay<T>(time: number, result?: T): Promise<T | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), time);
  });
}
