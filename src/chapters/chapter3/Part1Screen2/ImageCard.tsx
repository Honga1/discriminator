import { ResponsiveContext, Text } from "grommet";
import { memo, useContext, useEffect, useRef } from "react";
import { animated, config, useSpring, useTransition } from "react-spring";
import { colorTheme } from "src/theme";
import styled from "styled-components";
import { ImageText } from "./ImageText";
import {
  MegafaceImageDescriptor,
  part1Screen2Store,
  Tinting,
  usePart1Screen2Store,
} from "./Part1Screen2Store";

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
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
      part1Screen2Store.getState().autoPickableImageCards.set(image.url, ref);
    }, [image.url]);

    const isSmall = useContext(ResponsiveContext) === "small";

    const isTinted = usePart1Screen2Store((state) =>
      state.tinting.has(image.tagged)
    );

    const isFocused = usePart1Screen2Store(
      (state) => state.focusedElement === ref.current
    );

    const isUserControlled = usePart1Screen2Store((state) => state.userControl);

    const showData = usePart1Screen2Store((state) => state.showData);

    const isRevealed = usePart1Screen2Store(({ revealedImage }) => {
      const isRevealed =
        revealedImage === "SHOW_ALL" || revealedImage === ref.current;

      return isRevealed;
    });

    const { transformPosition, transformRotation } = useTransforms();

    const tintingTransition = useTransition(isTinted, {
      from: { backgroundColor: `rgba(0, 0, 0, 0)` },
      enter: { backgroundColor: imageTagToColor(image.tagged) },
      leave: { backgroundColor: `rgba(0, 0, 0, 0)` },
    });

    const revealedTransition = useTransition(isRevealed, {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
    });

    const dataTransition = useTransition(isFocused, {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
    });

    const missingImageTextTransition = useTransition(
      isFocused && image.imageSrc.includes("missing_image"),
      {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
      }
    );

    const [overlay] = useSpring(() => {
      return {
        opacity: isFocused && image.overlaySrc !== undefined ? 1 : 0,
        delay: 1000,
      };
    }, [isFocused, image.overlaySrc]);

    return (
      <animated.div
        ref={ref}
        data-url={image.url}
        className="image-card"
        style={{
          position: "relative",
          transform: transformPosition,
          width: width * 100 + "%",
          height: height * 100 + "%",
        }}
      >
        <animated.div
          style={{
            transform: transformRotation,
            backfaceVisibility: "hidden",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: "absolute",
            touchAction: "none",
            pointerEvents: "auto",
            userSelect: "none",
            cursor: !isUserControlled
              ? "auto"
              : isFocused
              ? "zoom-out"
              : "zoom-in",
          }}
          onClick={() => {
            if (!isUserControlled) return;
            part1Screen2Store.setState({
              focusedElement: isFocused ? undefined : ref.current ?? undefined,
            });
          }}
        >
          <HoverBox selected={isFocused} interactive={isUserControlled}>
            {revealedTransition((style, isRevealed) =>
              isRevealed ? (
                <animated.div
                  style={{
                    ...style,
                    width: "100%",
                    height: "100%",
                    top: 0,
                    position: "absolute",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                      }}
                    >
                      {image.overlaySrc !== undefined && (
                        <animated.img
                          alt="data"
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            opacity: overlay.opacity,
                            objectFit: "cover",
                            userSelect: "none",
                            pointerEvents: "none",
                            display: "block",
                          }}
                          draggable={false}
                          src={image.overlaySrc}
                        />
                      )}
                      <img
                        src={image.imageSrc}
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          height: "100%",
                          userSelect: "none",
                          pointerEvents: "none",
                          display: "block",
                        }}
                        draggable={false}
                        alt="personal"
                      />
                    </div>

                    {missingImageTextTransition(
                      (style, isShown) =>
                        isShown && (
                          <animated.div
                            style={{ ...style, overflow: "hidden" }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                height: "100%",
                                width: "80%",
                                top: 0,
                                left: "50%",
                                transform: `translateX(-50%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backfaceVisibility: "hidden",
                              }}
                            >
                              <StyledText
                                size={isSmall ? "15%" : "30%"}
                                color={colorTheme.offWhite}
                                textAlign="center"
                              >
                                Image could no longer be retrieved
                              </StyledText>
                            </div>
                          </animated.div>
                        )
                    )}
                  </div>
                </animated.div>
              ) : (
                <animated.div
                  style={{
                    width: "100%",
                    height: "100%",
                    top: 0,
                    position: "absolute",
                    backfaceVisibility: "hidden",
                    touchAction: "none",
                    pointerEvents: "none",
                    background: "#502B2D",
                    border: "2px solid #FF4E4E",
                    ...style,
                  }}
                />
              )
            )}

            {tintingTransition((style, isTinted) =>
              isTinted ? (
                <animated.div
                  style={{
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
          </HoverBox>
        </animated.div>
        {showData &&
          dataTransition(
            (style, isFocused) =>
              isFocused && (
                <animated.div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    ...style,
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <div
                      style={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <ImageText descriptor={image} />
                    </div>
                  </div>
                </animated.div>
              )
          )}
      </animated.div>
    );
  }
);

const StyledText = styled(Text)`
  font-smooth: always !important;
  -webkit-font-smoothing: subpixel-antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility;
  user-select: none;
`;

const HoverBox = styled.div<{ selected: boolean; interactive: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  backface-visibility: hidden;
  transition: transform 0.2s ease-out;

  transform: ${(props) =>
    props.selected && props.interactive
      ? `scale(1.1) rotate(1deg)`
      : `scale(1) rotate(0deg)`};

  &:hover {
    transform: ${(props) =>
      props.interactive ? `scale(1.1) rotate(1deg)` : `scale(1) rotate(0deg)`};
  }
`;

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

function useTransforms() {
  const isSmall = useContext(ResponsiveContext) === "small";
  const targetRotation = useRef(Math.random() * 70 - 35);
  const startRotation = useRef(
    targetRotation.current + (Math.random() - 0.5) * 10
  );
  const startOffset = useRef(Math.random() * 100 - 50);
  const endOffset = useRef(Math.random() * 50 - 25);

  const [{ transformPosition, transformRotation }] = useSpring(() => {
    const startTranslation = isSmall
      ? `translate(${startOffset.current}%, 0%)`
      : `translate(0, ${startOffset.current}%)`;
    const endTranslation = isSmall
      ? `translate(${endOffset.current}%, 0%)`
      : `translate(0, ${endOffset.current}%)`;
    return {
      from: {
        transformPosition: `${startTranslation}`,
        transformRotation: `rotate(${startRotation.current}deg)`,
      },
      to: {
        transformPosition: `${endTranslation} `,
        transformRotation: `rotate(${targetRotation.current}deg)`,
      },
      config: config.wobbly,
      delay: 100,
    };
  }, []);

  return { transformPosition, transformRotation };
}
