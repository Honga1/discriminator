import { Box } from "grommet";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "react-three-fiber";
import { BufferAttribute, BufferGeometry } from "three";
import { useChapter } from "../../hooks/useChapter";
import { useStore } from "../../store/store";
import videoSrc from "./../../p2.mp4";
import { Stats } from "@react-three/drei";
import { useAnimationFrame } from "./chapter3/Chapter3";

function Dots(props: { geometry: React.Ref<React.ReactNode> | undefined }) {
  const { size } = useThree();
  return (
    <>
      <points
        scale={[size.width, size.height, 1]}
        position={[-size.width / 2, size.height / 2, -5]}
        frustumCulled={false}
      >
        <bufferGeometry ref={props.geometry}></bufferGeometry>
        <pointsMaterial color="red" size={10} />
      </points>
    </>
  );
}

export default function Chapter2() {
  const ref = useRef<HTMLVideoElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const geometry = useRef<BufferGeometry>(null);
  const [canvasAspectRatio, setCanvasAspectRatio] = useState(
    window.innerWidth / window.innerHeight
  );
  useChapter(ref, true);

  const webcamStream = useStore((state) => state.webcamStream);

  const tracker = useRef<clm.tracker>();

  useEffect(() => {
    if (!webcamStream || !webcamRef.current) return;
    const video = webcamRef.current;
    video.srcObject = webcamStream;

    const track = webcamStream.getVideoTracks()[0]!;
    video.width = track.getSettings().width!;
    video.height = track.getSettings().height!;

    setCanvasAspectRatio(video.width / video.height);

    video.play();
    tracker.current = new clm.tracker();
    tracker.current.init();
    tracker.current.start(video);
  }, [tracker, webcamStream]);

  useAnimationFrame(15, () => {
    const positions = tracker.current?.getCurrentPosition() || undefined;

    console.log(tracker.current?.getConvergence());
    if (!webcamStream || !webcamRef.current) return;
    const video = webcamRef.current;

    if (!positions) return;
    if (!geometry.current) return;

    const positions3d = positions.flatMap(([x, y], index) => [
      x / video.videoWidth,
      -y / video.videoHeight,
      0.0,
    ]);

    geometry.current?.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(positions3d), 3)
    );
  });

  return (
    <Box
      style={{ position: "relative", width: "100%", height: "100%" }}
      align="center"
    >
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
        hidden
      ></video>
      <Canvas
        style={{
          position: "absolute",
          width: Math.min(1 / canvasAspectRatio, 1) * 100 + "%",
          height: "100%",
        }}
        orthographic={true}
      >
        <Dots geometry={geometry}></Dots>
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

// function Chapter2CLMTracker() {
//   const ref = useRef<HTMLVideoElement>(null);
//   const webcamRef = useRef<HTMLVideoElement>(null);
//   const geometry = useRef<BufferGeometry>(null);
//   const [canvasAspectRatio, setCanvasAspectRatio] = useState(
//     window.innerWidth / window.innerHeight
//   );
//   useChapter(ref, true);

//   const webcamStream = useStore((state) => state.webcamStream);

//   const tracker = useRef<clm.tracker>();

//   useEffect(() => {
//     if (!webcamStream || !webcamRef.current) return;
//     const video = webcamRef.current;
//     video.srcObject = webcamStream;

//     const track = webcamStream.getVideoTracks()[0]!;
//     video.width = track.getSettings().width!;
//     video.height = track.getSettings().height!;

//     setCanvasAspectRatio(video.width / video.height);

//     video.play();
//     tracker.current = new clm.tracker();
//     tracker.current.init();
//     tracker.current.start(video);
//   }, [tracker, webcamStream]);

//   useAnimationFrame(15, () => {
//     const positions = tracker.current?.getCurrentPosition() || undefined;

//     console.log(tracker.current?.getConvergence());
//     if (!webcamStream || !webcamRef.current) return;
//     const video = webcamRef.current;

//     if (!positions) return;
//     if (!geometry.current) return;

//     const positions3d = positions.flatMap(([x, y], index) => [
//       x / video.videoWidth,
//       -y / video.videoHeight,
//       0.0,
//     ]);

//     geometry.current?.setAttribute(
//       "position",
//       new BufferAttribute(new Float32Array(positions3d), 3)
//     );
//   });

//   return (
//     <Box
//       style={{ position: "relative", width: "100%", height: "100%" }}
//       align="center"
//     >
//       <video
//         style={{
//           position: "absolute",
//           top: 0,
//           boxSizing: "border-box",
//           outline: "none",
//           width: "100%",
//           height: "100%",
//         }}
//         ref={webcamRef}
//         hidden
//       ></video>
//       <Canvas
//         style={{
//           position: "absolute",
//           width: Math.min(1 / canvasAspectRatio, 1) * 100 + "%",
//           height: "100%",
//         }}
//         orthographic={true}
//       >
//         <Dots geometry={geometry}></Dots>
//       </Canvas>
//       <video
//         ref={ref}
//         style={{
//           boxSizing: "border-box",
//           outline: "none",
//           width: "100%",
//           height: "100%",
//         }}
//         width="100%"
//         height="100%"
//         src={videoSrc}
//       ></video>
//     </Box>
//   );
// }
