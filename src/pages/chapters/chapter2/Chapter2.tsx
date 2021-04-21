import { Canvas } from "@react-three/fiber";
import "@tensorflow/tfjs-backend-webgl";
import { Box } from "grommet";
import React, { useRef } from "react";
import { useChapter } from "../../../hooks/useChapter";
import { useStore } from "../../../store/store";
import videoSrc from "./../../../p2.mp4";
import { Scene } from "./three/Scene";
import { usePredictions } from "./usePredictions";
import { useWebcamAndCanvas } from "./useWebcamAndCanvas";

export default function Chapter2() {
  const ref = useRef<HTMLVideoElement>(null);

  useChapter(ref, true);

  const webcamRef = useRef<HTMLVideoElement>(null);

  const webcamStream = useStore((state) => state.webcamStream);

  const [canvasWidth, canvasHeight] = useWebcamAndCanvas(
    webcamRef,
    ref,
    webcamStream
  );

  const predictions = usePredictions(webcamRef);

  return (
    <Box
      style={{ position: "relative", width: "100%", height: "100%" }}
      align="center"
      overflow="hidden"
    >
      <video
        style={{
          position: "absolute",
          boxSizing: "border-box",
          outline: "none",
          width: canvasWidth + "px",
          height: canvasHeight + "px",
          opacity: 0.5,
          top: "50%",
          transform: "translateY(-50%)",
        }}
        ref={webcamRef}
        // hidden
      ></video>
      <Canvas
        style={{
          position: "absolute",
          width: canvasWidth + "px",
          height: canvasHeight + "px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        orthographic={false}
      >
        <Scene predictions={predictions}></Scene>
      </Canvas>
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
