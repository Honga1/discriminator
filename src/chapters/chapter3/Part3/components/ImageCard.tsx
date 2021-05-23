import { ResponsiveContext, Text } from "grommet";
import { memo, useContext, useEffect, useRef } from "react";
import { animated, config, useSpring, useTransition } from "react-spring";
import { colorTheme } from "src/theme";
import styled from "styled-components";
import {
  MegafaceImageDescriptor,
  part3Store,
  Tinting,
  usePart3Store,
} from "../store/Part3Store";

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
      part3Store.getState().autoPickableImageCards.set(image.url, ref);
    }, [image.url]);

    const isSmall = useContext(ResponsiveContext) === "small";

    const isTinted = usePart3Store((state) => state.tinting.has(image.tagged));

    const isFocused = usePart3Store(
      (state) => state.focusedElement === ref.current
    );

    const isUserControlled = usePart3Store((state) => state.userControl);

    const { transformPosition, transformRotation } = useTransforms();

    const tintingTransition = useTransition(isTinted, {
      from: { backgroundColor: `rgba(0, 0, 0, 0)` },
      enter: { backgroundColor: imageTagToColor(image.tagged) },
      leave: { backgroundColor: `rgba(0, 0, 0, 0)` },
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
            WebkitBackfaceVisibility: "hidden",
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
            part3Store.setState({
              focusedElement: isFocused ? undefined : ref.current ?? undefined,
            });
          }}
        >
          <HoverBox selected={isFocused} interactive={isUserControlled}>
            <div
              style={{
                width: "100%",
                height: "100%",
                top: 0,
                position: "absolute",
                transform: `translate3d(0, 0, 0)`,
                WebkitTransform: `translate3d(0, 0, 0)`,
              }}
            >
              <div
                style={{
                  position: "relative",
                  transform: `translate3d(0, 0, 0)`,
                  WebkitTransform: `translate3d(0, 0, 0)`,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    pointerEvents: "none",
                    transform: `translate3d(0, 0, 0)`,
                    WebkitTransform: `translate3d(0, 0, 0)`,
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
                        objectFit: "contain",
                        userSelect: "none",
                        pointerEvents: "none",
                        display: "block",
                        transform: `translate3d(0, 0, 0)`,
                        WebkitTransform: `translate3d(0, 0, 0)`,
                        zIndex: 1,
                      }}
                      draggable={false}
                      src={image.overlaySrc}
                    />
                  )}
                  <img
                    src={image.imageSrc}
                    style={{
                      width: "100%",
                      objectFit: "contain",
                      height: "100%",
                      userSelect: "none",
                      pointerEvents: "none",
                      display: "block",
                      transform: `translate3d(0, 0, 0)`,
                      WebkitTransform: `translate3d(0, 0, 0)`,
                    }}
                    draggable={false}
                    alt="personal"
                  />
                  {tintingTransition((style, isTinted) =>
                    isTinted ? (
                      <animated.div
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          top: 0,
                          pointerEvents: "none",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transform: `translate3d(0, 0, 0)`,
                          WebkitTransform: `translate3d(0, 0, 0)`,

                          ...style,
                        }}
                      />
                    ) : null
                  )}
                </div>

                {missingImageTextTransition(
                  (style, isShown) =>
                    isShown && (
                      <animated.div style={{ ...style, overflow: "hidden" }}>
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
                            WebkitBackfaceVisibility: "hidden",
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
            </div>
          </HoverBox>
        </animated.div>
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
      ? `scale(1.3) rotate(1deg)`
      : `scale(1) rotate(0deg)`};

  &:hover {
    transform: ${(props) =>
      props.interactive ? `scale(1.3) rotate(1deg)` : `scale(1) rotate(0deg)`};
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
  const targetRotation = useRef(Math.random() * 70 - 35);
  const startRotation = useRef(
    targetRotation.current + (Math.random() - 0.5) * 10
  );
  const startOffset = useRef(Math.random() * 100 - 50);
  const endOffset = useRef(Math.random() * 40 - 20);

  const [{ transformPosition, transformRotation }] = useSpring(() => {
    const startTranslation = `translateX(${startOffset.current}%)`;
    const endTranslation = `translateX(${endOffset.current}%)`;
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
