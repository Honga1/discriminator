import { useCallback, useMemo, useRef, useState } from "react";
import { useMultipleMediaChapter } from "../../../hooks/useMultipleMediaChapter";
import part1AudioSrc from "./Chapter3Part1.mp3";
import { Part1Screen1 } from "./Part1Screen1";
import { Part1Screen2, Part1Screen2Props } from "./Part1Screen2";

export default function Chapter3() {
  const ref = useRef<HTMLAudioElement>(null);
  useMultipleMediaChapter([ref]);

  const [seconds, setSeconds] = useState(0);

  const onTimeUpdate: React.ReactEventHandler<HTMLAudioElement> = useCallback(
    (event) => {
      const audio: HTMLAudioElement = event.target as HTMLAudioElement;
      const seconds = Math.round(audio.currentTime);
      setSeconds(seconds);
    },
    []
  );

  const render = useMemo(() => {
    if (seconds < 30) {
      return <Part1Screen1 />;
    } else {
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
      }

      return <Part1Screen2 stage={stage} />;
    }
  }, [seconds]);

  return (
    <>
      <audio
        onTimeUpdate={onTimeUpdate}
        ref={ref}
        style={{ display: "hidden" }}
        controls={false}
        src={part1AudioSrc}
      />
      {render}
    </>
  );
}
