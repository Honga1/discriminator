import "@tensorflow/tfjs-backend-webgl";
import { Box } from "grommet";
import React, { useEffect, useRef, useState } from "react";
import { useChapter } from "../../hooks/useChapter";
import videoSrc from "./chapter2.mp4";
import { Part1 } from "./part1/Part1";

export default function Chapter2() {
  const ref = useRef<HTMLVideoElement>(null);

  useChapter(ref, true);

  const [part, setPart] = useState<
    "SCREEN_1_MASK_1" | "SCREEN_1_MASK_2" | "SCREEN_1_MASK_3" | "SCREEN_2"
  >("SCREEN_1_MASK_1");

  console.log("render");
  useEffect(() => {
    if (!ref.current) return;
    const video = ref.current;
    const onTimeUpdate = ({ nativeEvent: event }: { nativeEvent: Event }) => {
      const video = event.target as HTMLVideoElement;
      const seconds = Math.round(video.currentTime);
      console.log(seconds);

      if (seconds < 25) {
        setPart("SCREEN_1_MASK_1");
      } else if (seconds < 28) {
        setPart("SCREEN_1_MASK_2");
      } else if (seconds < 47) {
        setPart("SCREEN_1_MASK_3");
      } else {
        setPart("SCREEN_2");
      }
    };

    video.ontimeupdate = (event) => onTimeUpdate({ nativeEvent: event });
  }, []);

  const maskType =
    part === "SCREEN_1_MASK_1"
      ? "video"
      : part === "SCREEN_1_MASK_2"
      ? "brett"
      : "own";

  return (
    <Box
      style={{ position: "relative", width: "100%", height: "100%" }}
      align="center"
      overflow="hidden"
    >
      {part !== "SCREEN_2" && <Part1 maskType={maskType} />}
      <video
        ref={ref}
        style={{
          boxSizing: "border-box",
          outline: "none",
          width: "100%",
          height: "100%",
        }}
        width="100%"
        height="100%"
        src={videoSrc}
      ></video>
    </Box>
  );
}