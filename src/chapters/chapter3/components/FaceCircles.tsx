import { memo, ReactNode } from "react";
import { animated, useSpring } from "react-spring";
import { SquareDiv } from "./SquareDiv";
import blinking from "src/videos/blinking.mp4";

export const FaceCircle = ({
  isTalking,
  background,
  children,
}: {
  background: string;
  isTalking: boolean;
  children: ReactNode;
}) => {
  const [styles] = useSpring(
    {
      loop: isTalking,
      to: [
        {
          scale: isTalking ? 1.0 : 0.88,
        },
        {
          scale: isTalking ? 0.98 : 0.88,
        },
      ],
      from: { scale: 0.98 },
      config: {
        duration: 1000,
        easing: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
      },
    },
    [isTalking]
  );

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <animated.div style={{ width: "100%", height: "100%", ...styles }}>
        <SquareDiv
          style={{
            background: background,
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
            overflow: "hidden",
            borderRadius: "50%",
            background: "#202122",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          }}
        >
          {children}
        </SquareDiv>
      </div>
    </div>
  );
};
export const AdamFaceCircle = memo(({ isTalking }: { isTalking: boolean }) => {
  return (
    <FaceCircle isTalking={isTalking} background={"#312DFF"}>
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
    </FaceCircle>
  );
});

AdamFaceCircle.displayName = "AdamFaceCircle";

export const BrettFaceCircle = memo(({ isTalking }: { isTalking: boolean }) => {
  return (
    <FaceCircle isTalking={isTalking} background={"#168500"}>
      <video
        width="100%"
        controls={false}
        muted
        autoPlay
        loop
        playsInline
        style={{
          transform: `scale(2) translate(10%, 12%)`,
        }}
      >
        <source src={blinking} type="video/mp4" />
      </video>
    </FaceCircle>
  );
});

BrettFaceCircle.displayName = "BrettFaceCircle";
