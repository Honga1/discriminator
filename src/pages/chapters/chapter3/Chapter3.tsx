import { useCallback, useMemo, useRef, useState } from "react";
import { useChapter } from "../../../hooks/useChapter";
import { IMediaElement } from "../../../IMediaElement";
import { store } from "../../../store/store";
import { ChainedAudio } from "./ChainedAudio";
import part1AudioSrc from "./Chapter3Part1.mp3";
import part2AudioSrc from "./Chapter3Part2.mp3";
import part3AudioSrc from "./Chapter3Part3.mp3";
import { Part1Screen1 } from "./Part1Screen1";
import { Part1Screen2, Part1Screen2Props } from "./Part1Screen2";
import { Part2Screen1 } from "./Part2Screen1";
import { Part2Screen2 } from "./Part2Screen2";
import { Part2Screen3 } from "./Part2Screen3";
import { Part3Screen1, Part3Screen1Props } from "./Part3Screen1";

export default function Chapter3() {
  const ref = useRef<IMediaElement>(null);
  useChapter(ref, false);

  const [seconds, setSeconds] = useState(0);

  const onTimeUpdate = useCallback((event: Event) => {
    const audio = event.target as IMediaElement;
    const seconds = Math.round(audio.currentTime);
    setSeconds(seconds);
  }, []);

  console.log(seconds);
  const render = useMemo(() => {
    if (seconds < 15) {
      store.setState({ isHeadingShown: true });
    } else {
      store.setState({ isHeadingShown: false });
    }
    if (seconds < 30) {
      return <Part1Screen1 />;
    } else if (seconds < 96) {
      let stage: Part1Screen2Props["stage"];

      // Start at the time above it, ends at the if statement.
      if (seconds < 38) {
        stage = "NO_YEARS";
      } else if (seconds < 42) {
        stage = "2011";
      } else if (seconds < 45) {
        stage = "2010";
      } else if (seconds < 48) {
        stage = "2007";
      } else if (seconds < 52) {
        stage = "2013";
      } else if (seconds < 54) {
        stage = "2006";
      } else if (seconds < 56) {
        stage = "2012";
      } else if (seconds < 57) {
        stage = "ZOOMED_OUT";
      } else if (seconds < 60) {
        //  I see you
        stage = 0;
      } else if (seconds < 61) {
        stage = "ZOOMED_OUT";
      } else if (seconds < 65) {
        // "A kid with a pumpkin" ZOOMIN 1
        stage = 1;
      } else if (seconds < 66) {
        stage = "ZOOMED_OUT";
      } else if (seconds < 70) {
        // "I see, looks like you" ZOOMIN 2
        stage = 2;
      } else if (seconds < 72) {
        stage = "ZOOMED_OUT";
      } else if (seconds < 76) {
        // "There's a woman" ZOOMIN 3
        stage = 3;
      } else if (seconds < 77) {
        stage = "ZOOMED_OUT";
      } else if (seconds < 93) {
        //  "There's you" ZOOMIN 4
        stage = 4;
      } else if (seconds < 94) {
        stage = "ZOOMED_OUT";
      } else {
        stage = "USER_CONTROL";
        // ref.current?.pause();
      }

      return <Part1Screen2 stage={stage} />;
    } else if (seconds < 123) {
      return <Part2Screen1 />;
    } else if (seconds < 130) {
      return <Part2Screen2 />;
    } else if (seconds < 202) {
      return <Part2Screen3 />;
    } else if (seconds < 233) {
      let stage: Part3Screen1Props["stage"];

      if (seconds < 210) {
        stage = "NO_TINTING";
      } else if (seconds < 215) {
        stage = "WEDDING";
      } else if (seconds < 220) {
        stage = "PARTY";
      } else {
        stage = "FAMILY";
      }
      return <Part3Screen1 stage={stage} />;
    }
  }, [seconds]);

  const srcArray = useMemo(
    () => [part1AudioSrc, part2AudioSrc, part3AudioSrc],
    []
  );
  return (
    <>
      <ChainedAudio
        forwardRef={ref}
        srcArray={srcArray}
        onTimeUpdate={onTimeUpdate}
      />

      {render}
    </>
  );
}
