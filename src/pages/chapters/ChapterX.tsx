import { useCallback, useEffect, useRef } from "react";
import { store } from "../../store/store";
import videoSrc from "./../../720p.mp4";
export const ChapterX = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const play = useCallback(() => ref.current?.play(), []);
  const pause = useCallback(() => ref.current?.pause(), []);
  const rewind = useCallback(() => {
    if (ref.current) ref.current.currentTime = 0;
  }, []);
  const isChapterPlaying = useCallback(() => {
    if (!ref.current) return false;
    return !!(
      ref.current.currentTime > 0 &&
      !ref.current.paused &&
      !ref.current.ended &&
      ref.current.readyState > 2
    );
  }, []);
  const progress = useCallback(() => {
    if (!ref.current) return 0;
    return ref.current.currentTime / ref.current.duration;
  }, []);
  const setProgress = useCallback((progress: number) => {
    if (!ref.current) return 0;
    ref.current.currentTime = progress * ref.current.duration;
  }, []);

  useEffect(() => {
    store.setState({
      chapter: {
        play,
        pause,
        rewind,
        isPlaying: isChapterPlaying,
        progress,
        setProgress,
      },
    });
  }, [isChapterPlaying, pause, play, progress, rewind, setProgress]);

  return (
    <video
      ref={ref}
      style={{ boxSizing: "border-box", outline: "none" }}
      width="100%"
      src={videoSrc}
      onClick={() => (isChapterPlaying() ? pause() : play())}
    ></video>
  );
};
