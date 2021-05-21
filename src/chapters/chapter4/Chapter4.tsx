import { Html } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Box } from "grommet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { DashPlayer } from "src/components/DashPlayer";
import { WorldOffset } from "src/components/WorldOffset";
import { useChapter } from "src/hooks/useChapter";
import { useFaceApiPredictions } from "src/hooks/useFaceApiPredictions";
import { useStore } from "src/store/store";
import styled from "styled-components";
import {
  BufferGeometry,
  Mesh,
  ShaderMaterial,
  Vector3,
  VideoTexture,
} from "three";

export default function Chapter4() {
  const ref = useRef<HTMLVideoElement>(null);
  useChapter(ref, true);

  const [part, setPart] = useState<"VIDEO" | "INTERACTIVE">("VIDEO");

  useEffect(() => {
    if (!ref.current) return;
    const video = ref.current;
    const onTimeUpdate = ({ nativeEvent: event }: { nativeEvent: Event }) => {
      const video = event.target as HTMLVideoElement;
      const seconds = Math.round(video.currentTime);

      if (seconds < 64) {
        setPart("VIDEO");
      } else if (seconds < 119) {
        setPart("INTERACTIVE");
      } else {
        setPart("VIDEO");
      }
    };

    video.ontimeupdate = (event) => onTimeUpdate({ nativeEvent: event });
  }, []);

  return (
    <Box
      style={{ position: "relative", width: "100%", height: "100%" }}
      align="center"
      overflow="hidden"
    >
      {part !== "VIDEO" && (
        <Canvas
          linear
          orthographic
          style={{ position: "absolute", width: "100%", height: "100%" }}
        >
          <WebcamPlane />
        </Canvas>
      )}

      <DashPlayer
        ref={ref}
        style={{
          boxSizing: "border-box",
          outline: "none",
          width: "100%",
          height: "100%",
          opacity: part === "INTERACTIVE" ? "0" : "1",
        }}
        width="100%"
        height="100%"
        src={`https://discriminator-media-server.jaeperris.com/part4/stream.mpd`}
      ></DashPlayer>
    </Box>
  );
}

function WebcamPlane() {
  const webcam = useStore((state) => state.webcamHTMLElement);
  const aspect = useStore((state) => state.webcamAspect);
  const viewport = useThree((state) => state.viewport);

  const ref = useRef<Mesh<BufferGeometry, ShaderMaterial>>();
  const width = Math.min(viewport.width, viewport.height * aspect);
  const height = Math.min(viewport.width / aspect, viewport.height);

  const videoTexture = useMemo(() => {
    return new VideoTexture(webcam);
  }, [webcam]);

  const predictions = useFaceApiPredictions();

  useFrame(() => {
    if (topLeft.current && predictions.current !== undefined) {
      const { width, height, x, y } = predictions.current.detection.relativeBox;

      topLeft.current.position.lerp(
        new Vector3(x + width / 2, -y - height / 2, 0.0),
        0.1
      );
      topLeft.current.scale.lerp(new Vector3(width, height, 1.0), 0.1);
    }

    if (html.current && predictions.current !== undefined) {
      ReactDOM.render(
        <React.StrictMode>
          <StyledTBody>
            <tr>
              <td>confidence</td>
              <td>{predictions.current.detection.score.toFixed(2)}</td>
            </tr>
            <tr>
              <td>age</td>
              <td>{predictions.current.age.toFixed(2)}</td>
            </tr>
            <tr>
              <td>gender</td>
              <td>{predictions.current.gender}</td>
            </tr>
            <tr>
              <td>gender probability</td>
              <td>{predictions.current.genderProbability.toFixed(2)}</td>
            </tr>
            <tr>
              <td>
                <br></br>expression
              </td>
              <td></td>
            </tr>
            <tr>
              <td>angry</td>
              <td>{predictions.current.expressions.angry.toFixed(2)}</td>
            </tr>
            <tr>
              <td>disgusted</td>
              <td>{predictions.current.expressions.disgusted.toFixed(2)}</td>
            </tr>
            <tr>
              <td>fearful</td>
              <td>{predictions.current.expressions.fearful.toFixed(2)}</td>
            </tr>
            <tr>
              <td>happy</td>
              <td>{predictions.current.expressions.happy.toFixed(2)}</td>
            </tr>
            <tr>
              <td>neutral</td>
              <td>{predictions.current.expressions.neutral.toFixed(2)}</td>
            </tr>
            <tr>
              <td>sad</td>
              <td>{predictions.current.expressions.sad.toFixed(2)}</td>
            </tr>
            <tr>
              <td>surprised</td>
              <td>{predictions.current.expressions.surprised.toFixed(2)}</td>
            </tr>
          </StyledTBody>
        </React.StrictMode>,
        html.current
      );
    }
  });

  const topLeft = useRef<Mesh>();
  const html = useRef<HTMLDivElement>(null);
  return (
    <>
      <WorldOffset targetAspect={aspect}>
        <mesh ref={topLeft}>
          <planeBufferGeometry />
          <meshBasicMaterial wireframe />
          <Html ref={html} position={[0.5, 0.5, 0]}></Html>
        </mesh>
      </WorldOffset>
      <group scale={[width, height, 1]} position={[0, 0, -1]}>
        <mesh ref={ref}>
          <planeBufferGeometry />
          <meshBasicMaterial map={videoTexture} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}

const StyledTBody = styled.tbody`
  tr {
    vertical-align: top;
  }

  td {
    padding: 0 15px;
  }
`;
