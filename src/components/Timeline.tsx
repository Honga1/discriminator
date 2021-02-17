import { Box, BoxProps, Button, Grid, Stack, Text } from "grommet";
import React, { useEffect, useRef } from "react";
import { QueryButton } from "./RoutedAnchor";

export const Timeline = (props: BoxProps) => {
  return (
    <Box gap="8px">
      <Stack interactiveChild="first">
        <ChapterIndicators />
        <Scrubber />
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
    const y = event.changedTouches[1].clientY;
    return { x, y };
  } else {
    const x = event.clientX;
    const y = event.clientY;
    return { x, y };
  }
}

const Scrubber = ({
  onDragEnd,
  position = 0,
}: {
  position?: number;
  onDragEnd?: (percent: number) => void;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useDraggableElement(containerRef, buttonRef, position, onDragEnd);

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
        <Text size="small">Pause</Text>
        <Text size="small">Back</Text>
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
  percentageAcrossContainer: number,
  onDragEnd: ((percentageAcrossContainer: number) => void) | undefined
) {
  useEffect(() => {
    if (!container.current || !element.current) return;
    const containerDimensions = container.current.getBoundingClientRect();

    let dragInitial = 0;
    let dragCurrent = 0;
    let startPosition =
      containerDimensions.left +
      percentageAcrossContainer * containerDimensions.width;
    let isDragging: boolean = false;

    const setTransform = (clippedX: number) => {
      if (!element.current) return;
      element.current.style.transform = `translateX(${clippedX}px)`;
    };

    setTransform(startPosition);
    const onDragStart = (event: TouchEvent | MouseEvent) => {
      if (event.target !== element.current) {
        isDragging = false;
        return;
      }

      event.preventDefault();
      const { x } = getClickCoordinates(event);
      dragInitial = x - startPosition;
      isDragging = true;
    };

    const onDrag = (event: TouchEvent | MouseEvent) => {
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

    window.addEventListener("mousemove", onDrag, false);
    window.addEventListener("mousedown", onDragStart, false);
    window.addEventListener("mouseup", onDragEndInner, false);

    window.addEventListener("touchmove", onDrag, false);
    window.addEventListener("touchstart", onDragStart, false);
    window.addEventListener("touchend", onDragEndInner, false);

    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mousedown", onDragStart);
      window.removeEventListener("mouseup", onDragEndInner);

      window.removeEventListener("touchmove", onDrag);
      window.removeEventListener("touchstart", onDragStart);
      window.removeEventListener("touchend", onDragEndInner);
    };
  }, [element, onDragEnd, percentageAcrossContainer, container]);
}
