import { Box, Button, Layer } from "grommet";
import { FastForward, Pause, Play, Rewind } from "grommet-icons";
import { useEffect, useRef, useState } from "react";
import { ProgressIndicator } from "../../components/ProgressIndicator";
import { RoutedButton } from "../../components/RoutedAnchor";
import { chapterFlow, ChapterNumbers } from "../../Routes";
import { useStore } from "../../store/store";

const isVideoPlaying = function (video: HTMLVideoElement) {
  return !!(
    video.currentTime > 0 &&
    !video.paused &&
    !video.ended &&
    video.readyState > 2
  );
};

export const ChapterButtons = ({
  chapterNumber,
}: {
  chapterNumber: ChapterNumbers;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const url = `/chapter/${chapterNumber}?isChapter` as const;
  const video = useStore((state) => state.nextVideoToPlay);
  const [videoIsPlaying, setVideoIsPlaying] = useState(
    video && isVideoPlaying(video)
  );

  const [isIdle, setIdle] = useState(false);

  useEffect(() => {
    const localVideo = video;
    if (!localVideo) return;
    const onEnded = () => {
      setVideoIsPlaying(false);
    };
    localVideo.addEventListener("ended", onEnded);

    const onPlay = () => {
      setVideoIsPlaying(true);
    };
    localVideo.addEventListener("play", onPlay);

    const onPause = () => {
      setVideoIsPlaying(false);
    };
    localVideo.addEventListener("pause", onPause);

    return () => {
      localVideo.removeEventListener("ended", onEnded);
      localVideo.removeEventListener("play", onPlay);
      localVideo.removeEventListener("pause", onPause);
    };
  }, [video]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined = undefined;
    const onMouseMove = () => {
      if (!!timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }
      timeout = setTimeout(() => setIdle(true), 1000);
      setIdle(false);
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      timeout && clearTimeout(timeout);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const isShown = !videoIsPlaying || !isIdle;

  return (
    <>
      {isShown && (
        <Layer
          ref={ref as any}
          full="horizontal"
          modal={false}
          position="bottom"
          responsive={false}
          plain
        >
          <Box
            alignSelf="center"
            direction="row"
            background="grey"
            margin={{ bottom: "small" }}
          >
            <Button
              icon={<Play />}
              onClick={video?.play.bind(video)}
              disabled={videoIsPlaying}
            />
            <Button
              icon={<Pause />}
              onClick={video?.pause.bind(video)}
              disabled={!videoIsPlaying}
            />
            <RoutedButton
              icon={<FastForward />}
              href={chapterFlow[url].next}
              onClick={video?.pause.bind(video)}
            />
            <RoutedButton
              icon={<Rewind />}
              href={chapterFlow[url].previous}
              onClick={video?.pause.bind(video)}
            />
          </Box>
          <ProgressIndicator />
        </Layer>
      )}
    </>
  );
};
