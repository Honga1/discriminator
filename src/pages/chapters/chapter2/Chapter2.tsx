import "@tensorflow/tfjs-backend-webgl";
import { Box } from "grommet";
import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useChapter } from "../../../hooks/useChapter";
import { useStore } from "../../../store/store";
import videoSrc from "./../../../p2.mp4";
import { Scene } from "./three/Scene";
import { usePredictions } from "./usePredictions";
import { useWebcamAndCanvas } from "./useWebcamAndCanvas";

export default function Chapter2() {
  const ref = useRef<HTMLVideoElement>(null);

  useChapter(ref, true);

  return (
    <Box
      style={{ position: "relative", width: "100%", height: "100%" }}
      align="center"
    >
      <WebcamOverlay />
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

function WebcamOverlay() {
  const webcamRef = useRef<HTMLVideoElement>(null);

  const webcamStream = useStore((state) => state.webcamStream);

  const [canvasWidth, canvasHeight] = useWebcamAndCanvas(
    webcamRef,
    webcamStream
  );

  const predictions = usePredictions(webcamRef);

  return (
    <>
      <video
        style={{
          position: "absolute",
          top: 0,
          boxSizing: "border-box",
          outline: "none",
          width: "100%",
          height: "100%",
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
    </>
  );
}
