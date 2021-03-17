import { useCallback, useEffect } from "react";
import { store } from "../store/store";

export function useMultipleMediaChapter(
  ref: [
    React.RefObject<HTMLVideoElement | HTMLAudioElement>,
    ...React.RefObject<HTMLVideoElement | HTMLAudioElement>[]
  ]
) {
  const play = useCallback(() => ref[0].current?.play(), [ref]);
  const pause = useCallback(() => ref[0].current?.pause(), [ref]);
  const rewind = useCallback(() => {
    if (ref[0].current) ref[0].current.currentTime = 0;
  }, [ref]);
  const getIsPlaying = useCallback(() => {
    if (!ref[0].current) return false;
    return !!(
      ref[0].current.currentTime > 0 &&
      !ref[0].current.paused &&
      !ref[0].current.ended &&
      ref[0].current.readyState > 2
    );
  }, [ref]);

  const getProgress = useCallback(() => {
    if (!ref[0].current) return 0;
    return ref[0].current.currentTime / ref[0].current.duration;
  }, [ref]);

  const setProgress = useCallback(
    (progress: number) => {
      if (!ref[0].current) return;
      ref[0].current.currentTime = progress * ref[0].current.duration;
    },
    [ref]
  );

  const seekTimeDelta = useCallback(
    (delta: number) => {
      if (!ref[0].current) return;
      const target = ref[0].current.currentTime + delta;
      const clippedTarget = Math.min(
        Math.max(0, target),
        ref[0].current.duration
      );
      ref[0].current.currentTime = clippedTarget;
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

    const video = ref[0].current;

    ref[0].current?.addEventListener("click", onClick);
    ref[0].current?.addEventListener("playing", updateStore);
    ref[0].current?.addEventListener("pause", updateStore);
    ref[0].current?.addEventListener("timeupdate", updateStore);
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
    onClick,
    ref,
  ]);
}
