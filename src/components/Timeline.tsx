import { Box, BoxProps, Button, Grid, Stack, Text } from "grommet";
import { Pause, Rewind } from "grommet-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import { store } from "../store/store";
import { QueryButton } from "./RoutedAnchor";
export const Timeline = ({
  showScrubber = true,
  ...props
}: BoxProps & { showScrubber?: boolean }) => {
  const [progress, setProgress] = useState(
    store.getState().chapter?.progress() || 0
  );

  const wasPlaying = useRef(store.getState().chapter?.isPlaying() ?? false);

  useAnimationFrame(10, () => {
    if (!store.getState().chapter?.isPlaying()) return;
    const nextProgress = store.getState().chapter?.progress() || 0;
    if (nextProgress !== progress) setProgress(nextProgress);
  });

  const onScrubberDragStart = useCallback(() => {
    wasPlaying.current = store.getState().chapter?.isPlaying() ?? false;
    store.getState().chapter?.pause();
  }, []);

  const onScrubberDragEnd = useCallback((progress: number): void => {
    store.getState().chapter?.setProgress(progress);
    if (wasPlaying.current) store.getState().chapter?.play();
  }, []);

  const onScrubberDrag = useCallback((progress: number): void => {
    store.getState().chapter?.setProgress(progress);
  }, []);

  return (
    <Box gap="8px" {...props}>
      <Stack interactiveChild="first">
        <ChapterIndicators />
        {showScrubber && (
          <Scrubber
            position={progress}
            onDrag={onScrubberDrag}
            onDragStart={onScrubberDragStart}
            onDragEnd={onScrubberDragEnd}
          />
        )}
      </Stack>
      <Buttons />
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

  console.log(position);

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

const ChapterIndicators = () => {
  return (
    <Grid
      fill
      responsive={false}
      columns={{ count: 4, size: "auto" }}
      gap={"4px"}
    >
      <Button plain>
        <Box
          background={{ color: "yellowAlternative", opacity: 0.8 }}
          height="8px"
          style={{ pointerEvents: "none" }}
        />
      </Button>
      <Button plain>
        <Box
          background={{ color: "yellowAlternative", opacity: 0.8 }}
          height="8px"
          style={{ pointerEvents: "none" }}
        />
      </Button>
      <Button plain>
        <Box
          background={{ color: "yellowAlternative", opacity: 0.8 }}
          height="8px"
          style={{ pointerEvents: "none" }}
        />
      </Button>
      <Button plain>
        <Box
          background={{ color: "yellowAlternative", opacity: 0.8 }}
          height="8px"
          style={{ pointerEvents: "none" }}
        />
      </Button>
    </Grid>
  );
};

const Buttons = () => {
  return (
    <Box
      direction="row"
      justify="between"
      flex={false}
      pad={{ horizontal: "16px", top: "0px", bottom: "8px" }}
      align="center"
    >
      <Box direction="row" gap={"20px"} align="center">
        <Button plain icon={<Pause />}></Button>
        <Button plain icon={<Rewind />}></Button>
      </Box>
      <Box direction="row" gap={"20px"} alignSelf="center">
        <QueryButton
          plain
          query={{ key: "modal", value: "about", operation: "open" }}
          label={
            <Text size="small" color="blue">
              About
            </Text>
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
            <Text size="small" color="red">
              Privacy
            </Text>
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
            <Text size="small" color="green">
              Credits
            </Text>
          }
        />
      </Box>
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
