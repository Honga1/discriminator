import { Box, Image, ResponsiveContext, Text } from "grommet";
import { memo, useContext, useRef } from "react";
import { animated, config, useSpring, useTransition } from "react-spring";
import { colorTheme } from "src/theme";
import styled from "styled-components";
import { ImageText } from "./ImageText";
import {
  MegafaceImageDescriptor,
  Part1Screen2Context,
  Tinting,
} from "./Part1Screen2Context";

export const ImageCard = memo(
  ({
    width,
    height,
    image,
  }: {
    width: number;
    height: number;
    image: MegafaceImageDescriptor;
  }) => {
    const { tinting } = useContext(Part1Screen2Context);
    const isTinted = tinting.has(image.tagged);
    const targetRotation = useRef(Math.random() * 84 - 42);
    const startRotation = useRef(
      targetRotation.current + (Math.random() - 0.5) * 10
    );
    const startOffset = useRef(Math.random() * 100 - 50);
    const isSmall = useContext(ResponsiveContext) === "small";

    const [{ transform }] = useSpring(() => {
      const translation = isSmall
        ? `translate(${startOffset.current}%, 0%)`
        : `translate(0, ${startOffset.current}%)`;
      return {
        from: {
          transform: `${translation} rotate(${startRotation.current}deg)`,
        },
        to: {
          transform: `translate(0, 0)  rotate(${targetRotation.current}deg)`,
        },
        config: config.wobbly,
        delay: 100,
      };
    }, []);

    const tintingTransition = useTransition(isTinted, {
      from: { backgroundColor: `rgba(0, 0, 0, 0)` },
      enter: { backgroundColor: imageTagToColor(image.tagged) },
      leave: { backgroundColor: `rgba(0, 0, 0, 0)` },
    });

    return (
      <AnimatedBox
        flex={false}
        width={width * 100 + "%"}
        height={height * 100 + "%"}
        style={{ position: "relative" }}
      >
        <Box
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          <Box overflow="hidden">
            <Box
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
              }}
            >
              <ImageText descriptor={image} />
            </Box>
          </Box>
        </Box>
        <AnimatedBox
          style={{
            top: 1,
            left: 1,
            right: 1,
            bottom: 1,
            position: "absolute",
            transform: transform,
            backfaceVisibility: "hidden",
            zIndex: -1,
          }}
          background="#502B2D"
          border={{ color: "#FF4E4E", size: " 2px" }}
        />

        <AnimatedStyledBox
          className="image-card-image auto-pickable"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "absolute",
            transform,
          }}
        >
          <Box
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            {image.image_url.includes("missing_image") && (
              <Box overflow="hidden">
                <Box
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    size={isSmall ? "15%" : "30%"}
                    color={colorTheme.offWhite}
                    textAlign="center"
                  >
                    Image could no longer be retrieved
                  </Text>
                </Box>
              </Box>
            )}
            <StyledImage src={image.image_url} draggable={false} />
          </Box>
        </AnimatedStyledBox>

        {tintingTransition((style, isTinted) =>
          isTinted ? (
            <animated.div
              className={isTinted ? `tint-${image.tagged}` : ""}
              style={{
                transform: transform,
                position: "absolute",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                backfaceVisibility: "hidden",
                ...style,
              }}
            />
          ) : null
        )}
      </AnimatedBox>
    );
  }
);

const AnimatedStyledBox = animated(styled(Box)`
  will-change: "opacity";
  backface-visibility: hidden;
  user-select: none;
  touch-action: none;
  transition: opacity 1s;
  opacity: 0;
  &.is-picked {
    opacity: 1;
  }
`);

const StyledImage = styled(Image)`
  width: 100%;
  object-fit: cover;
  height: 100%;
`;

const AnimatedBox = animated(Box);

const imageTagToColor = (tinting: Tinting): string => {
  switch (tinting) {
    case "wedding":
      return `rgba(255, 89, 89, 0.4)`;
    case "family":
      return `rgba(32, 191, 0, 0.4)`;
    case "party":
      return `rgba(117, 122, 255, 0.4)`;
  }
};
