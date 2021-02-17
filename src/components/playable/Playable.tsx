import { Box, VideoProps } from "grommet";
import React, {
  forwardRef,
  MutableRefObject,
  PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PlayableControls } from "./PlayableControls";

export interface IPlayable {
  onEnded?: () => void;
  onPause?: () => void;
  onPlay?: () => void;
  onTimeUpdate?: () => void;
  onDurationChange?: () => void;
}

const useForwardedRef = <T extends any>(
  ref: ((instance: T | null) => void) | MutableRefObject<T | null> | null
) => {
  const innerRef = useRef<T>(null);
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      ref.current = innerRef.current;
    }
  });

  return innerRef;
};

type Props = {
  mute?: boolean;
  onEnded?: () => void;
  onPause?: () => void;
  onPlay?: () => void;
  onTimeUpdate?: () => void;
  onVolumeChange?: () => void;
  playable: () => React.ForwardRefExoticComponent<
    IPlayable & React.RefAttributes<HTMLVideoElement>
  >;
};

const Playable = forwardRef<
  HTMLVideoElement,
  PropsWithChildren<Props & VideoProps>
>(({ playable, mute, onEnded, onPause, onPlay, onTimeUpdate }, ref) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playing, setPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [height, setHeight] = useState<number>();
  const [width, setWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>();
  const videoRef = useForwardedRef(ref);

  // mute if needed
  useEffect(() => {
    const video = videoRef.current;
    if (video && mute) video.muted = true;
  }, [mute, videoRef]);

  // when the video is first rendered, set state from it where needed
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setDuration(video.duration);
  }, [videoRef]);

  // turn off interacting after a while
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      setInteracting(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [interacting]);

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.videoHeight) {
      // set the size based on the video aspect ratio
      const rect = video.getBoundingClientRect();
      const ratio = rect.width / rect.height;
      const videoRatio = video.videoWidth / video.videoHeight;
      if (videoRatio > ratio) {
        const nextHeight = rect.width / videoRatio;
        if (nextHeight !== height) {
          setHeight(nextHeight);
          setWidth(undefined);
        }
      } else {
        const nextWidth = rect.height * videoRatio;
        if (nextWidth !== width) {
          setHeight(undefined);
          setWidth(nextWidth);
        }
      }
    }
  }, [height, videoRef, width]);

  const play = useCallback(() => videoRef.current?.play(), [videoRef]);
  const pause = useCallback(() => videoRef.current?.pause(), [videoRef]);

  const clamp = (value: number, min: number, max: number): number =>
    Math.min(Math.max(min, value), max);

  const changeVolume = (deltaVolume: number): void => {
    if (!videoRef.current) return;
    const requestedVolume = clamp(videoRef.current.volume + deltaVolume, 0, 1);

    videoRef.current.volume = requestedVolume;
  };

  const PlayableChild = useMemo(() => playable(), [playable]);

  return (
    <Box
      ref={containerRef as any}
      onMouseEnter={() => setInteracting(true)}
      onMouseMove={() => setInteracting(true)}
      onTouchStart={() => setInteracting(true)}
      style={{
        flex: "1 1",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        zIndex: 0,
      }}
    >
      <PlayableChild
        ref={videoRef}
        onEnded={() => {
          setPlaying(false);
          if (onEnded) onEnded();
        }}
        onPause={() => {
          setPlaying(false);
          if (onPause) onPause();
        }}
        onPlay={() => {
          setPlaying(true);
          setHasPlayed(true);
          if (onPlay) onPlay();
        }}
        onTimeUpdate={() => {
          const video = videoRef.current;
          if (!video) return;
          setCurrentTime(video.currentTime);
          if (onTimeUpdate) onTimeUpdate();
        }}
        onDurationChange={() => {
          const video = videoRef.current;
          if (!video) return;
          setDuration(video.duration);
        }}
      />

      {/* <PlayableControls
        onVolumeChange={changeVolume}
        onSeek={(time) => {
          if (!videoRef.current) return;
          return (videoRef.current.currentTime = time);
        }}
        onPause={pause}
        onPlay={() => {
          return play();
        }}
        active={!hasPlayed || interacting}
        playing={playing}
        duration={duration}
        currentTime={currentTime}
      /> */}
    </Box>
  );
});

export { Playable };
