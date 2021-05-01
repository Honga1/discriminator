import { Howl } from "howler";
import React, { useEffect, useMemo } from "react";
import { useStore } from "src/store/store";
import loop1Caf from "./loops/part1.caf";
import loop1Ogg from "./loops/part1.ogg";
import loop2Caf from "./loops/part2.caf";
import loop2Ogg from "./loops/part2.ogg";
import loop3Caf from "./loops/part3.caf";
import loop3Ogg from "./loops/part3.ogg";

export function useLoopedAudio(
  ref: React.RefObject<HTMLAudioElement>,
  isAutoPaused: boolean,
  part: string
) {
  const [loop1Audio, loop2Audio, loop3Audio] = useMemo(() => {
    const loop1Audio = new Howl({
      src: [loop1Ogg, loop1Caf],
      html5: true,
      loop: true,
      volume: 0.0,
    });

    const loop2Audio = new Howl({
      src: [loop2Ogg, loop2Caf],
      html5: true,
      loop: true,
      volume: 0.0,
    });

    const loop3Audio = new Howl({
      src: [loop3Ogg, loop3Caf],
      html5: true,
      loop: true,
      volume: 0.0,
    });

    return [loop1Audio, loop2Audio, loop3Audio];
  }, []);

  const isMuted = useStore((state) => state.chapter?.isMuted ?? false);

  useEffect(() => {
    loop1Audio.mute(isMuted);
    loop2Audio.mute(isMuted);
    loop3Audio.mute(isMuted);
  }, [isMuted, loop1Audio, loop2Audio, loop3Audio]);

  useEffect(() => {
    const mainAudio = ref.current;
    const onPlay = () => {
      !loop1Audio.playing() && loop1Audio.play();
      !loop2Audio.playing() && loop2Audio.play();
      !loop3Audio.playing() && loop3Audio.play();
    };
    mainAudio?.addEventListener("play", onPlay);

    const onPause = () => {
      if (!isAutoPaused) {
        loop1Audio.pause();
        loop2Audio.pause();
        loop3Audio.pause();
      }
    };
    mainAudio?.addEventListener("pause", onPause);

    return () => {
      mainAudio?.removeEventListener("play", onPlay);
      mainAudio?.removeEventListener("pause", onPause);
    };
  }, [isAutoPaused, loop1Audio, loop2Audio, loop3Audio, ref]);

  useEffect(() => {
    switch (true) {
      case part.includes("PART_1"):
        loop1Audio.fade(loop1Audio.volume(), 0.1, 2000);
        loop2Audio.fade(loop2Audio.volume(), 0.0, 2000);
        loop3Audio.fade(loop3Audio.volume(), 0.0, 2000);
        break;
      case part.includes("PART_2"):
        loop1Audio.fade(loop1Audio.volume(), 0.0, 2000);
        loop2Audio.fade(loop2Audio.volume(), 0.1, 2000);
        loop3Audio.fade(loop3Audio.volume(), 0.0, 2000);
        break;
      case part.includes("PART_3"):
        loop1Audio.fade(loop1Audio.volume(), 0.0, 2000);
        loop2Audio.fade(loop2Audio.volume(), 0.0, 2000);
        loop3Audio.fade(loop3Audio.volume(), 0.1, 2000);
        break;
    }
  }, [loop1Audio, loop2Audio, loop3Audio, part]);
}
