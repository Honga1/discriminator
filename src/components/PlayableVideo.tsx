import { StyledVideo } from "grommet/components/Video/StyledVideo";
import { forwardRef } from "react";
import { IPlayable } from "./Playable";

export const PlayableVideo = (sources: { src: string; type: string }[]) => () =>
  forwardRef<HTMLVideoElement, IPlayable>(
    ({ onEnded, onPause, onPlay, onTimeUpdate, onDurationChange }, ref) => {
      return (
        <StyledVideo
          fit={"contain"}
          ref={ref}
          onEnded={onEnded}
          onPause={onPause}
          onPlay={onPlay}
          onTimeUpdate={onTimeUpdate}
          onDurationChange={onDurationChange}
          autoPlay={false}
          loop={false}
        >
          {sources.map(({ src, type }) => {
            return <source key={src} src={src} type={type} />;
          })}
        </StyledVideo>
      );
    }
  );

export const PlayableInteraction = () =>
  forwardRef<HTMLVideoElement, IPlayable>(
    ({ onEnded, onPause, onPlay, onTimeUpdate, onDurationChange }, ref) => {
      return (
        <StyledVideo
          fit={"contain"}
          ref={ref}
          onEnded={onEnded}
          onPause={onPause}
          onPlay={onPlay}
          onTimeUpdate={onTimeUpdate}
          onDurationChange={onDurationChange}
          autoPlay={false}
          loop={false}
        ></StyledVideo>
      );
    }
  );
