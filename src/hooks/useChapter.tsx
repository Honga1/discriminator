import { useCallback, useEffect } from "react";
import { store } from "../store/store";
import { IMediaElement } from "./IMediaElement";

export function useChapter(ref: React.RefObject<IMediaElement>) {
  const play = useCallback(() => ref.current?.play(), [ref]);
  const pause = useCallback(() => ref.current?.pause(), [ref]);
  const rewind = useCallback(() => {
    if (ref.current) ref.current.currentTime = 0;
  }, [ref]);
  const getIsPlaying = useCallback(() => {
    if (!ref.current) return false;
    return !!(
      ref.current.currentTime > 0 &&
      !ref.current.paused &&
      !ref.current.ended &&
      ref.current.readyState > 2
    );
  }, [ref]);

  const getProgress = useCallback(() => {
    if (!ref.current) return 0;
    return ref.current.currentTime / ref.current.duration;
  }, [ref]);

  const setProgress = useCallback(
    (progress: number) => {
      if (!ref.current) return;
      ref.current.currentTime = progress * ref.current.duration;
    },
    [ref]
  );

  const seekTimeDelta = useCallback(
    (delta: number) => {
      if (!ref.current) return;
      const target = ref.current.currentTime + delta;
      const clippedTarget = Math.min(Math.max(0, target), ref.current.duration);
      ref.current.currentTime = clippedTarget;
    },
    [ref]
  );
  const onClick = useCallback(() => (getIsPlaying() ? pause() : play()), [
    getIsPlaying,
    pause,
    play,
  ]);

  useEffect(() => {
    const updateStore = () => {
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
          intention: getIsPlaying() ? "PLAY" : "PAUSE",
        },
      });
    };

    const video = ref.current;

    ref.current?.addEventListener("click", onClick);
    ref.current?.addEventListener("playing", updateStore);
    ref.current?.addEventListener("pause", updateStore);
    ref.current?.addEventListener("timeupdate", updateStore);
    updateStore();
    return () => {
      video?.removeEventListener("click", onClick);
      video?.removeEventListener("play", updateStore);
      video?.removeEventListener("pause", updateStore);
      video?.removeEventListener("timeupdate", updateStore);
      store.setState({ chapter: undefined });
    };
  }, [
    getIsPlaying,
    pause,
    play,
    getProgress,
    rewind,
    setProgress,
    seekTimeDelta,
    ref,
    onClick,
  ]);
}
