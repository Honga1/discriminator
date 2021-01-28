import { Box, Button, Meter, Stack, Text } from "grommet";
import { Pause, Play } from "grommet-icons";
import {
  StyledVideoControls,
  StyledVideoScrubber,
} from "grommet/components/Video/StyledVideo";
import React, { useCallback, useRef, useState } from "react";
import { PlayableSettingsMenu } from "./PlayableSettingsMenu";

export const PlayableControls = ({
  onVolumeChange,
  onPause,
  onPlay,
  active,
  playing,
  onSeek,
  duration,
  currentTime,
}: {
  onVolumeChange: (volume: number) => void;
  onPause: () => void;
  onPlay: () => void;
  onSeek: (time: number) => void;
  active: boolean;
  playing: boolean;
  duration: number;
  currentTime: number;
}) => {
  const scrubberRef = useRef<HTMLElement>();
  const [scrubTime, setScrubTime] = useState<number>();
  const formattedTime = formatTime(scrubTime || currentTime || duration);
  const percentagePlayed = (currentTime / duration) * 100;

  const scrub = useCallback(
    (event: React.MouseEvent) => {
      if (!scrubberRef.current) return;
      const scrubberRect = scrubberRef.current.getBoundingClientRect();
      const percent = (event.clientX - scrubberRect.left) / scrubberRect.width;
      setScrubTime(duration * percent);
    },
    [duration]
  );

  const seek = useCallback(
    (event: MouseEvent) => {
      if (!scrubberRef.current) return;
      const scrubberRect = scrubberRef.current.getBoundingClientRect();
      const percent = (event.clientX - scrubberRect.left) / scrubberRect.width;
      onSeek(duration * percent);
    },
    [duration, onSeek]
  );

  return (
    <StyledVideoControls over={true} active={active}>
      <Box
        direction="row"
        align="center"
        justify="between"
        background={{
          color: "background-back",
          opacity: "strong",
          dark: true,
        }}
      >
        <Button
          icon={playing ? <Pause /> : <Play />}
          hoverIndicator="background"
          onClick={playing ? onPause : onPlay}
        />
        <Box direction="row" align="center" flex>
          <Box flex>
            <Stack>
              <Meter
                size="full"
                thickness="small"
                values={[{ value: percentagePlayed || 0 }]}
              />
              <StyledVideoScrubber
                ref={scrubberRef}
                tabIndex={0}
                role="button"
                value={
                  scrubTime
                    ? Math.round((scrubTime / duration) * 100)
                    : undefined
                }
                onMouseMove={scrub}
                onMouseLeave={() => setScrubTime(undefined)}
                onClick={seek}
              />
            </Stack>
          </Box>
          <Box pad={{ horizontal: "small" }}>
            <Text margin="none">{formattedTime}</Text>
          </Box>
        </Box>
        <PlayableSettingsMenu onVolumeChange={onVolumeChange} />
      </Box>
    </StyledVideoControls>
  );
};

const formatTime = (time: number) => {
  let minutes: number | string = Math.round(time / 60);
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let seconds: number | string = Math.round(time) % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
};
