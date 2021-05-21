import { Box } from "grommet";
import { useEffect, useRef, useState } from "react";
import { animated, useTransition } from "react-spring";
import { colorTheme } from "src/theme";
import styled from "styled-components";

export function Pings({
  isFocused,
  imageCards,
}: {
  isFocused: boolean;
  imageCards: Map<string, { current: HTMLElement | null }>;
}) {
  const [pings, setPings] = useState<{ x: number; y: number; key: number }[]>(
    []
  );
  const count = useRef(0);

  useEffect(() => {
    const timeout = setInterval(async () => {
      const keys = [...imageCards.keys()];

      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      if (!randomKey) return;
      const cardToPing = imageCards.get(randomKey);
      if (!cardToPing)
        throw new Error(
          `Could not get card ${randomKey} from cards ${imageCards}`
        );

      if (!cardToPing.current) return;

      const bb = cardToPing.current.getBoundingClientRect();
      const x = bb.x;
      const y = bb.y;

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
    }, 1000);

    return () => clearTimeout(timeout);
  }, [imageCards]);

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
        {transition(
          (style, item) =>
            !isFocused && (
              <animated.div
                style={{
                  position: "absolute",
                  x: item.x,
                  y: item.y,
                  opacity: style.opacity,
                  width: "45px",
                  height: "45px",
                }}
              >
                <animated.div
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
                </animated.div>
              </animated.div>
            )
        )}
      </Box>
    </Box>
  );
}
const PulsingCircle = styled.div<{ delay: number }>`
  border-radius: 50%;
  animation: scaleIn 2s cubic-bezier(0.36, 0.11, 0.89, 0.32);
  position: absolute;
  border: 2px solid ${colorTheme.offWhite};
  width: 100%;
  height: 100%;
  animation-delay: ${(props) => props.delay}s;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  user-select: none;
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
