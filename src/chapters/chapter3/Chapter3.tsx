import { useTransition } from "@react-spring/core";
import { Box } from "grommet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { animated } from "react-spring";
import { useChapter } from "../../hooks/useChapter";
import { store, useStore } from "../../store/store";
import audioSrc from "./audio/Chapter3.mp3";
import { ContinueButton } from "./components/ContinueButton";
import { useLoopedAudio } from "./hooks/useLoopedAudio";
import { Part1Screen1 } from "./Part1Screen1/Part1Screen1";
import { Part1Screen2Selector } from "./Part1Screen2/Part1Screen2";
import { Part2Screen1 } from "./Part2Screen1";
import { Part2Screen2 } from "./Part2Screen2";
import { Part2Screen3 } from "./Part2Screen3/Part2Screen3";
import { Part3Selector } from "./Part3/Part3";

export default function Chapter3() {
  const ref = useRef<HTMLAudioElement>(null);

  const [getByteData, audio] = useMemo(() => {
    const speakingAudio = document.createElement("audio");
    speakingAudio.src = audioSrc;
    const context = new AudioContext();
    const source = context.createMediaElementSource(speakingAudio);
    const analyser = context.createAnalyser();
    source.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 64;
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    speakingAudio.addEventListener("play", () => {
      if (context.state === "suspended") context.resume();
    });

    return [
      () => {
        analyser.getByteTimeDomainData(dataArray);
        return dataArray;
      },
      speakingAudio,
    ];
  }, []);

  useEffect(() => {
    return () => audio.pause();
  }, [audio]);

  useEffect(() => {
    (ref as any).current = audio;
  }, [audio]);

  useChapter(ref, false);
  const [seconds, setSeconds] = useState(0);

  const isPlaying = seconds !== 0;
  useEffect(() => {
    store.setState({ isCameraEnabled: false });
  }, [isPlaying]);

  const [allowAutoPause, setAllowAutoPause] = useState(false);
  const [isAutoPaused, setIsAutoPaused] = useState(false);

  const [part, setPart] =
    useState<
      | "PART_1_SCREEN_1"
      | "PART_1_SCREEN_2"
      | "PART_2_SCREEN_1"
      | "PART_2_SCREEN_2"
      | "PART_2_SCREEN_3"
      | "PART_3_SCREEN_1"
    >("PART_1_SCREEN_1");

  const isMuted = useStore((state) => state.chapter?.isMuted ?? false);
  useLoopedAudio(ref, isAutoPaused, part, isMuted);

  useEffect(() => {
    const onTimeUpdate = ({ nativeEvent: event }: { nativeEvent: Event }) => {
      const audio = event.target as HTMLAudioElement;
      const seconds = Math.round(audio.currentTime);
      setSeconds(seconds);
      console.log(seconds);
      if (seconds < 15) {
        store.setState({ isHeadingShown: true });
      } else {
        store.setState({ isHeadingShown: false });
      }

      if (seconds < 33) {
        setAllowAutoPause(true);
        setPart("PART_1_SCREEN_1");
        setIsAutoPaused(false);
      } else if (seconds < 96) {
        if (seconds >= 94) {
          if (allowAutoPause && !isAutoPaused) {
            ref.current?.pause();
            setIsAutoPaused(true);
            setAllowAutoPause(false);
          }
        } else {
          setAllowAutoPause(true);
          setIsAutoPaused(false);
        }
        setPart("PART_1_SCREEN_2");
      } else if (seconds < 123) {
        setAllowAutoPause(true);
        setIsAutoPaused(false);
        setPart("PART_2_SCREEN_1");
      } else if (seconds < 158) {
        setAllowAutoPause(true);
        setIsAutoPaused(false);

        setPart("PART_2_SCREEN_2");
      } else if (seconds < 178) {
        if (seconds >= 176) {
          if (allowAutoPause && !isAutoPaused) {
            ref.current?.pause();
            setIsAutoPaused(true);
            setAllowAutoPause(false);
          }
        } else {
          setAllowAutoPause(true);
          setIsAutoPaused(false);
        }
        setPart("PART_2_SCREEN_3");
      } else {
        setAllowAutoPause(true);
        setIsAutoPaused(false);
        setPart("PART_3_SCREEN_1");
      }
    };

    audio.ontimeupdate = (event) => onTimeUpdate({ nativeEvent: event });
    audio.onplay = () => {
      return setIsAutoPaused(false);
    };
  }, [allowAutoPause, audio, isAutoPaused]);

  const transition = useTransition(part, {
    from: { opacity: 0 },
    enter: (item) => async (next) => {
      await next({ opacity: 0 });
      await next({ opacity: 1, delay: 300 });
    },
    leave: { opacity: 0 },
  });

  return (
    <>
      <Box style={{ position: "relative" }} width="100%" height="100%">
        <ContinueButton
          play={() => ref.current?.play()}
          isAutoPaused={isAutoPaused}
        />

        {transition((style, part) => {
          return (
            <animated.div
              style={{
                ...style,
                position: "absolute",
                top: 0,
                width: "100%",
                height: "100%",
              }}
            >
              {part === "PART_1_SCREEN_1" && (
                <Part1Screen1 getByteData={getByteData} seconds={seconds} />
              )}
              {part === "PART_1_SCREEN_2" && (
                <Part1Screen2Selector seconds={seconds} />
              )}
              {part === "PART_2_SCREEN_1" && <Part2Screen1 />}
              {part === "PART_2_SCREEN_2" && <Part2Screen2 seconds={seconds} />}
              {part === "PART_2_SCREEN_3" && <Part2Screen3 seconds={seconds} />}
              {part === "PART_3_SCREEN_1" && (
                <Part3Selector seconds={seconds} />
              )}
            </animated.div>
          );
        })}
      </Box>
    </>
  );
}
