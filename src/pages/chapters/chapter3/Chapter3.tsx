import { Box, ResponsiveContext } from "grommet";
import React, { useContext, useRef, useState } from "react";
import { FinishedButton } from "../../../components/FinishedButton";
import { useChapter } from "../../../hooks/useChapter";
import { useIsActive } from "../../../hooks/useIsActive";
import { IMediaElement } from "../../../IMediaElement";
import { store } from "../../../store/store";
import audioSrc from "./Chapter3.mp3";
import { Part1Screen1 } from "./Part1Screen1";
import { Part1Screen2Selector } from "./Part1Screen2";
import { Part2Screen1 } from "./Part2Screen1";
import { Part2Screen2 } from "./Part2Screen2";
import { Part2Screen3 } from "./Part2Screen3";
import { Part3Screen1Selector } from "./Part3Screen1";

function ContinueButton(props: { isAutoPaused: boolean; play?: () => void }) {
  const isSmall = useContext(ResponsiveContext) === "small";
  const isActive = useIsActive();

  return (
    <Box
      style={{
        position: "absolute",
        bottom: isSmall ? "48px" : "64px",
        right: 0,
      }}
    >
      {props.isAutoPaused && (
        <FinishedButton
          shouldProgress={!isActive}
          shouldShow={props.isAutoPaused}
          text="Continue"
          textWidth="200px"
          toProgress={props.play}
        />
      )}
    </Box>
  );
}

export default function Chapter3() {
  const ref = useRef<HTMLAudioElement>(null);
  useChapter(ref, false);
  const [seconds, setSeconds] = useState(0);

  const [allowAutoPause, setAllowAutoPause] = useState(false);
  const [isAutoPaused, setIsAutoPaused] = useState(false);

  const [part, setPart] = useState<
    | "PART_1_SCREEN_1"
    | "PART_1_SCREEN_2"
    | "PART_2_SCREEN_1"
    | "PART_2_SCREEN_2"
    | "PART_2_SCREEN_3"
    | "PART_3_SCREEN_1"
  >("PART_1_SCREEN_1");

  const onTimeUpdate = ({ nativeEvent: event }: { nativeEvent: Event }) => {
    const audio = event.target as IMediaElement;
    const seconds = Math.round(audio.currentTime);
    setSeconds(seconds);
    if (seconds < 15) {
      store.setState({ isHeadingShown: true });
    } else {
      store.setState({ isHeadingShown: false });
    }

    if (seconds < 30) {
      setAllowAutoPause(true);
      setPart("PART_1_SCREEN_1");
    } else if (seconds < 96) {
      if (seconds >= 94) {
        if (allowAutoPause && !isAutoPaused) {
          ref.current?.pause();
          setIsAutoPaused(true);
          setAllowAutoPause(false);
        }
      } else {
        setAllowAutoPause(true);
      }
      setPart("PART_1_SCREEN_2");
    } else if (seconds < 123) {
      setAllowAutoPause(true);

      setPart("PART_2_SCREEN_1");
    } else if (seconds < 168) {
      setAllowAutoPause(true);

      setPart("PART_2_SCREEN_2");
    } else if (seconds < 187) {
      if (seconds >= 185) {
        if (allowAutoPause && !isAutoPaused) {
          ref.current?.pause();
          setIsAutoPaused(true);
          setAllowAutoPause(false);
        }
      } else {
        setAllowAutoPause(true);
      }
      setPart("PART_2_SCREEN_3");
    } else {
      setAllowAutoPause(true);
      setPart("PART_3_SCREEN_1");
    }
  };

  return (
    <>
      <audio
        ref={ref}
        src={audioSrc}
        onTimeUpdate={onTimeUpdate}
        onPlay={() => setIsAutoPaused(false)}
      />

      <Box style={{ position: "relative" }} width="100%" height="100%">
        <ContinueButton
          play={() => ref.current?.play()}
          isAutoPaused={isAutoPaused}
        />

        {part === "PART_1_SCREEN_1" && <Part1Screen1 />}
        {part === "PART_1_SCREEN_2" && (
          <Part1Screen2Selector seconds={seconds} />
        )}
        {part === "PART_2_SCREEN_1" && <Part2Screen1 />}
        {part === "PART_2_SCREEN_2" && <Part2Screen2 />}
        {part === "PART_2_SCREEN_3" && <Part2Screen3 />}
        {part === "PART_3_SCREEN_1" && (
          <Part3Screen1Selector seconds={seconds} />
        )}
      </Box>
    </>
  );
}
