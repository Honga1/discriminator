import { Box, BoxProps, Button, Grid, Stack, Text } from "grommet";
import { Pause, Play, Rewind } from "grommet-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useIsActive } from "../pages/chapters/useIsActive";
import { store, useStore } from "../store/store";
import { colorTheme } from "../theme";
import { QueryButton } from "./RoutedAnchor";
export const Timeline = ({
  showScrubber = true,
  ...props
}: BoxProps & { showScrubber?: boolean }) => {
  return (
    <Box gap="8px" {...props}>
      <Stack interactiveChild="first">
        <ChapterIndicators />
      </Stack>
      <ModalOpenButtons />
    </Box>
  );
};

function isTouchEvent(event: TouchEvent | MouseEvent): event is TouchEvent {
  return event.type.startsWith("touch");
}

function getClickCoordinates(
  event: TouchEvent | MouseEvent
): { x: number; y: number } {
  if (isTouchEvent(event)) {
    const x = event.changedTouches[0].clientX;
    const y = event.changedTouches[0].clientY;
    return { x, y };
  } else {
    const x = event.clientX;
    const y = event.clientY;
    return { x, y };
  }
}

const ClickableBox = styled(Box)`
  & {
    position: relative;
  }
  &:after {
    content: "";
    position: absolute;
    top: -10px;
    bottom: -10px;
    left: -10px;
    right: -10px;
    z-index: -1;
  }
`;

const ChapterIndicator = ({ chapter }: { chapter: number }) => {
  const chapterNumber = useStore((state) => state.chapter?.chapterNumber);
  const ref = useRef<HTMLDivElement>(null);
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const clickWasOnIndicator = event.target === ref.current;
    if (!clickWasOnIndicator) return;
    const thisIsTheCurrentChapter = chapterNumber === chapter;
    if (!thisIsTheCurrentChapter) return;
    const { x } = getClickCoordinates(event.nativeEvent);
    const rect = (event.target as HTMLDivElement).getBoundingClientRect();
    const relativeX = Math.min(Math.max((x - rect.x) / rect.width, 0), 1);

    store.getState().chapter?.setProgress(relativeX);
  };
  const thisIsTheCurrentChapter = chapterNumber === chapter;
  return (
    <ClickableBox ref={ref as any} onClick={onClick}>
      {thisIsTheCurrentChapter && <StoreScrubber />}
      <Box
        background={{ color: "yellowAlternative", opacity: 0.8 }}
        height="8px"
        style={{ pointerEvents: "none" }}
      />
    </ClickableBox>
  );
};

const ChapterIndicators = () => {
  return (
    <Grid
      fill
      responsive={false}
      columns={{ count: 4, size: "auto" }}
      gap={"4px"}
    >
      <ChapterIndicator chapter={1} />
      <ChapterIndicator chapter={2} />
      <ChapterIndicator chapter={3} />
      <ChapterIndicator chapter={4} />
    </Grid>
  );
};

const PlayPauseButton = () => {
  const Icon = useStore((state) =>
    state.chapter?.intention === undefined ||
    state.chapter?.intention === "PAUSE" ? (
      <Play />
    ) : (
      <Pause />
    )
  );

  return (
    <Button
      plain
      onClick={() =>
        store.getState().chapter?.getIsPlaying()
          ? store.getState().chapter?.pause()
          : store.getState().chapter?.play()
      }
      icon={Icon}
    ></Button>
  );
};

const RewindButton = () => {
  return (
    <Button
      plain
      onClick={() => store.getState().chapter?.seekTimeDelta(-10)}
      icon={<Rewind />}
    ></Button>
  );
};

const FadeColorText = styled(Text)<{ textColor: string }>`
  color: ${(props) => props.textColor};
  transition: color 0.4s;
`;

const ModalOpenButtons = () => {
  const isActive = useIsActive();
  return (
    <Box
      direction="row"
      justify="between"
      flex={false}
      pad={{ horizontal: "16px", top: "0px", bottom: "8px" }}
      align="center"
    >
      <Box direction="row" gap={"20px"} align="center">
        <PlayPauseButton />
        <RewindButton />
      </Box>
      <Box direction="row" gap={"20px"} alignSelf="center">
        <QueryButton
          plain
          query={{ key: "modal", value: "about", operation: "open" }}
          label={
            <FadeColorText
              size="small"
              textColor={isActive ? colorTheme["blue"] : colorTheme.white}
            >
              About
            </FadeColorText>
          }
        />
        <QueryButton
          plain
          query={{
            key: "modal",
            value: "privacy",
            operation: "open",
          }}
          label={
            <FadeColorText
              size="small"
              textColor={isActive ? colorTheme["red"] : colorTheme.white}
            >
              Privacy
            </FadeColorText>
          }
        />
        <QueryButton
          plain
          query={{
            key: "modal",
            value: "credits",
            operation: "open",
          }}
          label={
            <FadeColorText
              size="small"
              textColor={isActive ? colorTheme["green"] : colorTheme.white}
            >
              Credits
            </FadeColorText>
          }
        />
      </Box>
    </Box>
  );
};

const StoreScrubber = () => {
  const [isDragging, setIsDragging] = useState(false);
  const progress = useStore(
    (state) => state.chapter?.progress || 0,
    (oldState, newState) => {
      const isSame = oldState === newState;
      if (isSame) return true;
      return isDragging;
    }
  );

  const wasPlaying = useRef(store.getState().chapter?.getIsPlaying() ?? false);

  const onScrubberDragStart = useCallback(() => {
    setIsDragging(true);
    wasPlaying.current = store.getState().chapter?.getIsPlaying() ?? false;
    store.getState().chapter?.pause();
  }, []);

  const onScrubberDragEnd = useCallback((progress: number): void => {
    setIsDragging(false);
    store.getState().chapter?.setProgress(progress);
    if (wasPlaying.current) store.getState().chapter?.play();
  }, []);

  const onScrubberDrag = useCallback((progress: number): void => {
    store.getState().chapter?.setProgress(progress);
  }, []);

  return (
    <Scrubber
      position={progress}
      onDrag={onScrubberDrag}
      onDragStart={onScrubberDragStart}
      onDragEnd={onScrubberDragEnd}
    />
  );
};

const Scrubber = ({
  onDragStart,
  onDrag,
  onDragEnd,
  position = 0,
}: {
  position?: number;
  onDragStart?: () => void;
  onDrag?: (position: number) => void;
  onDragEnd?: (position: number) => void;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useDraggableElement(
    containerRef,
    buttonRef,
    position,
    onDragStart,
    onDrag,
    onDragEnd
  );

  return (
    <Box
      fill="horizontal"
      ref={containerRef}
      style={{ pointerEvents: "none", transform: "translateY(-50%)" }}
    >
      <Button
        style={{ position: "absolute", pointerEvents: "auto" }}
        ref={buttonRef}
        plain
        margin={{ top: "-7px", left: "-13px" }}
      >
        <Box
          style={{ pointerEvents: "none" }}
          round="100%"
          background="yellowAlternative"
          width="26px"
          height="26px"
        ></Box>
      </Button>
    </Box>
  );
};

function useDraggableElement(
  container: React.RefObject<HTMLDivElement>,
  element: React.RefObject<HTMLElement>,
  relativePosition: number,
  onDragStart: (() => void) | undefined,
  onDrag: ((relativePosition: number) => void) | undefined,
  onDragEnd: ((relativePosition: number) => void) | undefined
) {
  useEffect(() => {
    if (!container.current || !element.current) return;
    const containerDimensions = container.current.getBoundingClientRect();

    let dragInitial = 0;
    let dragCurrent = 0;
    let startPosition = 0 + relativePosition * containerDimensions.width;
    let isDragging: boolean = false;

    const setTransform = (clippedX: number) => {
      if (!element.current) return;
      element.current.style.transform = `translateX(${clippedX}px)`;
    };

    setTransform(startPosition);
    const onDragStartInner = (event: TouchEvent | MouseEvent) => {
      if (event.target !== element.current) {
        isDragging = false;
        return;
      }

      event.preventDefault();
      const { x } = getClickCoordinates(event);
      dragInitial = x - startPosition;
      isDragging = true;
      onDragStart?.();
    };

    const onDragInner = (event: TouchEvent | MouseEvent) => {
      if (!isDragging) return;
      if (!element.current) return;
      event.preventDefault();

      const { x } = getClickCoordinates(event);

      dragCurrent = x - dragInitial;

      const clippedX = Math.min(
        Math.max(dragCurrent, 0),
        containerDimensions.width
      );
      dragCurrent = clippedX;
      const relativeX = clippedX / containerDimensions.width;

      onDrag?.(relativeX);
      setTransform(clippedX);
    };

    const onDragEndInner = (event: TouchEvent | MouseEvent) => {
      if (!isDragging) return;
      event.preventDefault();
      startPosition = dragCurrent;
      const clippedX = Math.min(
        Math.max(dragCurrent, 0),
        containerDimensions.width
      );
      const relativeX = clippedX / containerDimensions.width;

      onDragEnd?.(relativeX);
      isDragging = false;
    };

    window.addEventListener("mousemove", onDragInner, false);
    window.addEventListener("mousedown", onDragStartInner, false);
    window.addEventListener("mouseup", onDragEndInner, false);

    window.addEventListener("touchmove", onDragInner, { passive: false });
    window.addEventListener("touchstart", onDragStartInner, { passive: false });
    window.addEventListener("touchend", onDragEndInner, { passive: false });

    return () => {
      window.removeEventListener("mousemove", onDragInner);
      window.removeEventListener("mousedown", onDragStartInner);
      window.removeEventListener("mouseup", onDragEndInner);

      window.removeEventListener("touchmove", onDragInner);
      window.removeEventListener("touchstart", onDragStartInner);
      window.removeEventListener("touchend", onDragEndInner);
    };
  }, [element, onDragEnd, relativePosition, container, onDragStart, onDrag]);
}
