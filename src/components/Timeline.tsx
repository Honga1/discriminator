import {
  Box,
  BoxProps,
  Button,
  DropButton,
  Grid,
  ResponsiveContext,
  Text,
} from "grommet";
import { Pause, Play, Rewind } from "grommet-icons";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
      <ChapterIndicators />
      <ControlButtonRow />
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

const LeftInsetOutline = styled.div`
  & {
    position: relative;
  }
  &:before {
    position: absolute;
    content: "";
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-left: 2px solid ${colorTheme.yellow};
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
  const isActive = useIsActive();
  return (
    <ClickableBox ref={ref as any} onClick={onClick}>
      {thisIsTheCurrentChapter && <StoreScrubber />}
      <Box
        background={{ color: "yellowAlternative", opacity: 0.8 }}
        height="8px"
        style={{ pointerEvents: "none" }}
      >
        {thisIsTheCurrentChapter && isActive && (
          <LeftInsetOutline
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              height: "102px",
            }}
          >
            <Box
              background="black"
              pad="10px"
              border={{ color: "yellow", size: "2px" }}
            >
              <Text size="small" color="offWhite">
                Chapter 1
              </Text>
            </Box>
          </LeftInsetOutline>
        )}
      </Box>
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
  const offWhite = colorTheme.offWhite;
  const Icon = useStore((state) =>
    state.chapter?.intention === undefined ||
    state.chapter?.intention === "PAUSE" ? (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 6L26 16L8 26V6Z" fill={offWhite} />
      </svg>
    ) : (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="7" y="6" width="6" height="20" fill={offWhite} />
        <rect x="19" y="6" width="6" height="20" fill={offWhite} />
      </svg>
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
      color="offWhite"
    ></Button>
  );
};

const RewindButton = () => {
  const offWhite = colorTheme.offWhite;

  return (
    <Button
      plain
      onClick={() => store.getState().chapter?.seekTimeDelta(-10)}
      icon={
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0)">
            <path
              d="M16 6C21.5228 6 26 10.4772 26 16C26 21.5228 21.5228 26 16 26C10.4772 26 6 21.5228 6 16C6 13.239 7.11898 10.7393 8.92817 8.92969"
              stroke={offWhite}
              stroke-width="3"
            />
            <path
              d="M10.006 5.32348L17.5519 1.86969L15.9737 11.0902L10.006 5.32348Z"
              fill={offWhite}
            />
            <path
              d="M14.1289 19H13V14.6484L11.6523 15.0664V14.1484L14.0078 13.3047H14.1289V19ZM19.8086 16.6484C19.8086 17.4349 19.6458 18.0365 19.3203 18.4531C18.9948 18.8698 18.5182 19.0781 17.8906 19.0781C17.2708 19.0781 16.7969 18.8737 16.4688 18.4648C16.1406 18.056 15.9727 17.4701 15.9648 16.707V15.6602C15.9648 14.8659 16.1289 14.263 16.457 13.8516C16.7878 13.4401 17.263 13.2344 17.8828 13.2344C18.5026 13.2344 18.9766 13.4388 19.3047 13.8477C19.6328 14.2539 19.8008 14.8385 19.8086 15.6016V16.6484ZM18.6797 15.5C18.6797 15.0286 18.6146 14.6862 18.4844 14.4727C18.3568 14.2565 18.1562 14.1484 17.8828 14.1484C17.6172 14.1484 17.4206 14.2513 17.293 14.457C17.168 14.6602 17.1016 14.9792 17.0938 15.4141V16.7969C17.0938 17.2604 17.1562 17.6055 17.2812 17.832C17.4089 18.056 17.612 18.168 17.8906 18.168C18.1667 18.168 18.3659 18.0599 18.4883 17.8438C18.6107 17.6276 18.6745 17.2969 18.6797 16.8516V15.5Z"
              fill={offWhite}
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="32" height="32" fill={offWhite} />
            </clipPath>
          </defs>
        </svg>
      }
      color="offWhite"
    ></Button>
  );
};

const NextChapterButton = () => {
  const offWhite = colorTheme.offWhite;

  return (
    <Button
      plain
      onClick={() => console.log("next chapter")}
      icon={
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6L20 16L4 26V6Z" fill={offWhite} />
          <rect
            width="5"
            height="20"
            transform="matrix(-1 0 0 1 27 6)"
            fill={offWhite}
          />
        </svg>
      }
      color="offWhite"
    ></Button>
  );
};

const ChapterSelectDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <DropButton
      plain
      onOpen={onOpen}
      onClose={onClose}
      open={isOpen}
      label={
        <Box direction="row">
          <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
            1/4
          </Text>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6 19.9646L8.98938 22.954L16 15.9434L23.0106 22.954L26 19.9646L16.0354 10L16 10.0354L15.9646 10L6 19.9646Z"
              fill={colorTheme.offWhite}
            />
          </svg>
        </Box>
      }
      dropContent={
        <Box
          background="black"
          pad="24px"
          border={{ color: "offWhite", size: "3px" }}
          gap="24px"
        >
          <QueryButton
            query={{ key: "modal", value: "about", operation: "open" }}
            plain
            onClick={onClose}
            label={
              <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
                Chapter 1
              </Text>
            }
          />
          <QueryButton
            query={{ key: "modal", value: "about", operation: "open" }}
            plain
            onClick={onClose}
            label={
              <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
                Chapter 2
              </Text>
            }
          />
          <QueryButton
            query={{ key: "modal", value: "about", operation: "open" }}
            plain
            onClick={onClose}
            label={
              <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
                Chapter 3
              </Text>
            }
          />
          <QueryButton
            query={{ key: "modal", value: "about", operation: "open" }}
            plain
            onClick={onClose}
            label={
              <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
                Chapter 4
              </Text>
            }
          />
        </Box>
      }
    />
  );
};

const FadeColorText = styled(Text)<{ textColor: string }>`
  color: ${(props) => props.textColor};
  transition: color 0.4s;
`;

const ControlButtonRow = () => {
  const isActive = useIsActive();
  const isSmall = useContext(ResponsiveContext) === "small";
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
        <NextChapterButton />
        <ChapterSelectDropdown />
      </Box>
      {!isSmall && (
        <Box direction="row" gap={"20px"} alignSelf="center">
          <QueryButton
            plain
            query={{ key: "modal", value: "about", operation: "open" }}
            label={
              <FadeColorText
                size="small"
                textColor={
                  isActive ? colorTheme["blueLight"] : colorTheme.offWhite
                }
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
                textColor={
                  isActive ? colorTheme["redLight"] : colorTheme.offWhite
                }
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
                textColor={
                  isActive ? colorTheme["greenLight"] : colorTheme.offWhite
                }
              >
                Credits
              </FadeColorText>
            }
          />
        </Box>
      )}
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
