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
  const getIsPlaying = useCallback(() => {
    if (!ref.current) return false;
    return !!(
      ref.current.currentTime > 0 &&
      !ref.current.paused &&
      !ref.current.ended &&
      ref.current.readyState > 2
    );
  }, []);

  const getProgress = useCallback(() => {
    if (!ref.current) return 0;
    return ref.current.currentTime / ref.current.duration;
  }, []);

  const setProgress = useCallback((progress: number) => {
    if (!ref.current) return;
    ref.current.currentTime = progress * ref.current.duration;
  }, []);

  const seekTimeDelta = useCallback((delta: number) => {
    if (!ref.current) return;
    const target = ref.current.currentTime + delta;
    const clippedTarget = Math.min(Math.max(0, target), ref.current.duration);
    ref.current.currentTime = clippedTarget;
  }, []);

  useEffect(() => {
    const updateStore = (
      event?: HTMLMediaElementEventMap["play" | "pause"]
    ) => {
      return store.setState({
        chapter: {
          play,
          pause,
          rewind,
          getIsPlaying,
          getProgress,
          setProgress,
          seekTimeDelta,
          progress: getProgress(),
          chapterNumber: 1,
          intention: getIsPlaying() ? "PLAY" : "PAUSE",
        },
      });
    };

    const video = ref.current;
    ref.current?.addEventListener("playing", updateStore);
    ref.current?.addEventListener("pause", updateStore);
    ref.current?.addEventListener("timeupdate", updateStore);
    updateStore();
    return () => {
      video?.removeEventListener("play", updateStore);
      video?.removeEventListener("pause", updateStore);
      video?.removeEventListener("timeupdate", updateStore);
    };
  }, [
    getIsPlaying,
    pause,
    play,
    getProgress,
    rewind,
    setProgress,
    seekTimeDelta,
  ]);

  return (
    <video
      ref={ref}
      style={{ boxSizing: "border-box", outline: "none" }}
      width="100%"
      src={videoSrc}
      onClick={() => (getIsPlaying() ? pause() : play())}
    ></video>
  );
};
