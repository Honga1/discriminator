import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import "@tensorflow/tfjs-backend-webgl";
import { Box } from "grommet";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "react-three-fiber";
import { BufferAttribute, BufferGeometry, Mesh } from "three";
import useResizeObserver from "use-resize-observer";
import { useChapter } from "../../hooks/useChapter";
import { useStore } from "../../store/store";
import videoSrc from "./../../p2.mp4";
import { useAsyncMemo } from "./chapter2/useAsyncMemo";
import { useAnimationFrame } from "./chapter3/useAnimationFrame";

import { RoundedBox } from "@react-three/drei";

type V3 = [number, number, number];
type V2 = [number, number];

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
  const rectRef = useRef<Mesh>();
  const webcamRef = useRef<HTMLVideoElement>(null);
  const geometry = useRef<BufferGeometry>(null);

  const webcamStream = useStore((state) => state.webcamStream);

  const [canvasWidth, canvasHeight] = useWebcamAndCanvas(
    webcamRef,
    webcamStream
  );
  const predictions = usePredictions(webcamRef);

  useAnimationFrame(60, async () => {
    if (!webcamRef.current || !rectRef.current) return;
    const video = webcamRef.current;

    if (predictions.current?.length <= 0) return;

    const landmarks = predictions.current[0]!.scaledMesh as V3[];
    const topLeft = predictions.current[0]!.boundingBox.topLeft as V2;
    const bottomRight = predictions.current[0]!.boundingBox.bottomRight! as V2;

    const positions3d = landmarks.flatMap(
      ([x, y, z], index) =>
        [
          x / video.videoWidth,
          -y / video.videoHeight,
          z / video.videoWidth,
        ] as V3
    );

    geometry.current?.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(positions3d), 3)
    );

    const centerX = (topLeft[0] + bottomRight[0]) / 2;
    const centerY = (topLeft[1] + bottomRight[1]) / 2;

    const width = bottomRight[0] - topLeft[0];
    const height = bottomRight[1] - topLeft[1];

    rectRef.current.scale.setX(width / video.videoWidth);
    rectRef.current.scale.setY(height / video.videoHeight);
    rectRef.current.position.setX(centerX / video.videoWidth);
    rectRef.current.position.setY(-centerY / video.videoHeight);
  });

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
        <Dots geometry={geometry}></Dots>
        <Rect rectRef={rectRef}></Rect>
      </Canvas>
    </>
  );
}

function useWebcamAndCanvas(
  webcamRef: React.RefObject<HTMLVideoElement>,
  webcamStream: MediaStream | undefined
) {
  const { width: videoDivWidth, height: videoDivHeight } = useResizeObserver({
    ref: webcamRef,
  });

  const [[canvasWidth, canvasHeight], setCanvasSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    if (
      !webcamRef.current ||
      !videoDivWidth ||
      !videoDivHeight ||
      !webcamStream
    )
      return;
    const video = webcamRef.current;

    if (video.srcObject !== webcamStream) {
      video.srcObject = webcamStream;
      video.play();
    }

    const track = webcamStream.getVideoTracks()[0]!;
    video.width = track.getSettings().width!;
    video.height = track.getSettings().height!;

    const videoAspect = video.width / video.height;
    const width = Math.min(videoDivWidth, videoDivHeight * videoAspect);
    const height = Math.min(videoDivWidth / videoAspect, videoDivHeight);
    setCanvasSize([width, height]);
  }, [videoDivHeight, videoDivWidth, webcamRef, webcamStream]);

  return [canvasWidth, canvasHeight];
}

function usePredictions(webcamRef: React.RefObject<HTMLVideoElement>) {
  const predictions = useRef<AnnotatedPrediction[]>([]);
  const model = useModel();

  useAnimationFrame(60, async () => {
    if (!webcamRef.current || !model) return;
    const video = webcamRef.current;

    if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;

    predictions.current = await model.estimateFaces({
      input: webcamRef.current,
      returnTensors: false,
      flipHorizontal: false,
      predictIrises: false,
    });
  });

  return predictions;
}

function useModel() {
  return useAsyncMemo(
    async () => {
      console.log("Loading model");
      const model = await facemesh.load(
        facemesh.SupportedPackages.mediapipeFacemesh,
        {
          shouldLoadIrisModel: false,
          maxFaces: 1,
        }
      );

      console.log("Loaded model");
      return model;
    },
    [],
    undefined
  );
}

function Dots(props: { geometry: React.Ref<React.ReactNode> | undefined }) {
  const { viewport } = useThree();
  return (
    <points
      scale={[viewport.width, viewport.height, 1]}
      position={[-viewport.width / 2, viewport.height / 2, 0]}
      frustumCulled={false}
    >
      <bufferGeometry ref={props.geometry}></bufferGeometry>
      <pointsMaterial color="#20BF00" size={0.08} />
    </points>
  );
}

function Rect(props: { rectRef: React.Ref<React.ReactNode> | undefined }) {
  const { viewport } = useThree();

  return (
    <group
      scale={[viewport.width, viewport.height, 1]}
      position={[-viewport.width / 2, viewport.height / 2, 0]}
    >
      <mesh ref={props.rectRef} frustumCulled={false}>
        <planeBufferGeometry />
        <meshNormalMaterial color={"red"} transparent opacity={0.1} />
      </mesh>
    </group>
  );
}
