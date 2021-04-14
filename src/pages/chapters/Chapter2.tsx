import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import "@tensorflow/tfjs-backend-webgl";
import { Box } from "grommet";
import React, { PropsWithChildren, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import { BufferAttribute, BufferGeometry, Mesh } from "three";
import { useChapter } from "../../hooks/useChapter";
import { useStore } from "../../store/store";
import videoSrc from "./../../p2.mp4";
import { maskMesh, TRIANGULATION } from "./chapter2/mask";
import { usePredictions } from "./chapter2/usePredictions";
import { useWebcamAndCanvas } from "./chapter2/useWebcamAndCanvas";
import { useAnimationFrame } from "./chapter3/useAnimationFrame";

export type V3 = [number, number, number];
export type V2 = [number, number];

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
  const objectRef = useRef<Mesh>();

  const webcamStream = useStore((state) => state.webcamStream);

  const [canvasWidth, canvasHeight] = useWebcamAndCanvas(
    webcamRef,
    webcamStream
  );
  const predictions = usePredictions(webcamRef);

  useAnimationFrame(60, async () => {
    if (!rectRef.current) return;

    if (predictions.current?.length <= 0) return;

    const landmarks = predictions.current[0]!.scaledMesh as V3[];
    const topLeft = predictions.current[0]!.boundingBox.topLeft as V2;
    const bottomRight = predictions.current[0]!.boundingBox.bottomRight! as V2;

    const positions3d = landmarks.flat();

    geometry.current?.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(positions3d), 3)
    );

    const centerX = (topLeft[0] + bottomRight[0]) / 2;
    const centerY = (topLeft[1] + bottomRight[1]) / 2;

    const width = bottomRight[0] - topLeft[0];
    const height = bottomRight[1] - topLeft[1];

    rectRef.current.scale.setX(width);
    rectRef.current.scale.setY(height);
    rectRef.current.position.setX(centerX);
    rectRef.current.position.setY(centerY);
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
        <mesh ref={objectRef}>
          <boxBufferGeometry />
          <meshPhongMaterial color="#f3f3f3" wireframe />
        </mesh>
        <WorldOffset>
          <MaskOnOwnFaceWithImage predictions={predictions} />
          {/* <Dots geometry={geometry}></Dots> */}
          <Rect rectRef={rectRef}></Rect>
        </WorldOffset>
      </Canvas>
    </>
  );
}

/**
 * Makes world scale 0-1, and position 0-1 for width and height
 */
const WorldOffset = ({ children }: PropsWithChildren<{}>) => {
  const { viewport } = useThree();

  return (
    <group
      scale={[viewport.width, viewport.height, 1]}
      position={[-viewport.width / 2, viewport.height / 2, 0]}
    >
      {children}
    </group>
  );
};

const MaskOnOwnFaceWithImage = (props: {
  predictions: { current: AnnotatedPrediction[] };
}) => {
  const ref = useRef<Mesh>();
  // const texture = new TextureLoader().load('');
  // texture.encoding = sRGBEncoding;
  // texture.flipY = false;

  useFrame(() => {
    const geometry = ref.current?.geometry;
    if (geometry === undefined) return;
    if (!props.predictions.current || !props.predictions.current[0]) return;
    const mesh = props.predictions.current[0].scaledMesh as V3[];

    const positions = geometry.getAttribute("position");
    TRIANGULATION.forEach((vertexIndex, index) => {
      const vertex = mesh[vertexIndex];
      if (!vertex) return;
      const [x, y, z] = vertex;
      positions.setXYZ(index, x, y, -z);
    });
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={ref} geometry={maskMesh.geometry}>
      <meshNormalMaterial toneMapped={false} />
    </mesh>
  );
};

function Dots(props: { geometry: React.Ref<React.ReactNode> | undefined }) {
  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={props.geometry}></bufferGeometry>
      <pointsMaterial color="#20BF00" size={0.08} />
    </points>
  );
}

function Rect(props: { rectRef: React.Ref<React.ReactNode> | undefined }) {
  return (
    <group>
      <mesh ref={props.rectRef} frustumCulled={false}>
        <planeBufferGeometry />
        <meshNormalMaterial color={"red"} transparent opacity={0.1} />
      </mesh>
    </group>
  );
}
