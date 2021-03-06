import { ResponsiveContext } from "grommet";
import { memo, useContext, useEffect, useRef } from "react";
import { animated, config, useSpring, useTransition } from "react-spring";
import styled from "styled-components";
import {
  MegafaceImageDescriptor,
  part1Screen2Store,
  usePart1Screen2Store,
} from "../store/Part1Screen2Store";

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

    const isFocused = usePart1Screen2Store(
      (state) => state.focusedElement === ref.current
    );

    const isUserControlled = usePart1Screen2Store((state) => state.userControl);

    const isRevealed = usePart1Screen2Store(({ revealedImage }) => {
      const isRevealed =
        revealedImage === "SHOW_ALL" || revealedImage === ref.current;

      return isRevealed;
    });

    const { transformPosition, transformRotation } = useTransforms();

    useEffect(() => {
      if (isFocused) {
        part1Screen2Store.setState({ focusedData: image });
      }
    }, [image, isFocused]);

    const revealedTransition = useTransition(isRevealed, {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
    });

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
                          objectFit: "cover",
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
                    </div>
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
                    WebkitBackfaceVisibility: "hidden",
                    touchAction: "none",
                    pointerEvents: "none",
                    background: "#502B2D",
                    border: "2px solid #FF4E4E",
                    ...style,
                    transform: `translate3d(0, 0, 0)`,
                    WebkitTransform: `translate3d(0, 0, 0)`,
                  }}
                />
              )
            )}
          </HoverBox>
        </animated.div>
      </animated.div>
    );
  }
);

const HoverBox = styled.div<{ selected: boolean; interactive: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
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
