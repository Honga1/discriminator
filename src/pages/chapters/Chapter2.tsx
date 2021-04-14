import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import "@tensorflow/tfjs-backend-webgl";
import { Box } from "grommet";
import React, { PropsWithChildren, useRef } from "react";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import { Line } from "react-three-fiber/components";
import { BufferAttribute, BufferGeometry, Mesh, Vector3 } from "three";
import { useChapter } from "../../hooks/useChapter";
import { useStore } from "../../store/store";
import videoSrc from "./../../p2.mp4";
import { maskMesh, TRIANGULATION } from "./chapter2/mask";
import { usePredictions } from "./chapter2/usePredictions";
import { useWebcamAndCanvas } from "./chapter2/useWebcamAndCanvas";

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

const Scene = ({
  predictions,
}: {
  predictions: { current: AnnotatedPrediction[] };
}) => {
  const rectRef = useRef<Mesh>();
  const geometry = useRef<BufferGeometry>(null);

  useFrame(() => {
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
      {/* <mesh>
        <boxBufferGeometry />
        <meshPhongMaterial color="#f3f3f3" wireframe />
      </mesh> */}
      <WorldOffset>
        <MaskOnOwnFaceWithImage predictions={predictions} />
        <Dots geometry={geometry}></Dots>
        <Rect rectRef={rectRef}></Rect>
      </WorldOffset>
    </>
  );
};

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
  const line = useRef<THREE.Line>();
  const linehelper = useRef<THREE.Line>();
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

    if (!line.current) return;

    const a = new Vector3(mesh[151]![0]!, mesh[151]![1]!, -mesh[151]![2]!);
    const b = new Vector3(mesh[285]![0]!, mesh[285]![1]!, -mesh[285]![2]!);
    const c = new Vector3(mesh[55]![0]!, mesh[55]![1]!, -mesh[55]![2]!);

    const side1 = new Vector3().subVectors(a, b);
    const side2 = new Vector3().subVectors(a, c);
    const facingOutFromHead = new Vector3()
      .crossVectors(side2, side1)
      .normalize();

    const a2 = new Vector3(...mesh[4]!);
    const b2 = new Vector3(...mesh[10]!);
    const c2 = new Vector3(...mesh[152]!);
    const side3 = new Vector3().subVectors(a2, b2);
    const side4 = new Vector3().subVectors(a2, c2);
    const facingSidewaysFromHead = new Vector3()
      .crossVectors(side3, side4)
      .normalize();

    const up = new Vector3(...mesh[9]!)
      .sub(new Vector3(...mesh[199]!))
      .normalize();

    line.current.position.set(...mesh[4]!).add(new Vector3(0, 0, 0));

    const worldPosition = new Vector3();
    line.current.getWorldPosition(worldPosition);
    line.current.up.copy(up);
    line.current.lookAt(facingOutFromHead.clone().negate().add(worldPosition));

    const linePositions = linehelper.current?.geometry.getAttribute("position");
    if (!linePositions) return;
    linePositions.setXYZ(0, mesh[4]![0], mesh[4]![1], mesh[4]![2]!);
    // linePositions.setXYZ(1, mesh[4]![0], mesh[4]![1], mesh[4]![2]!);
    linePositions.setXYZ(1, ...new Vector3(...mesh[4]!).add(up).toArray());
    linePositions.setXYZ(2, mesh[4]![0], mesh[4]![1], mesh[4]![2]!);
    linePositions.setXYZ(
      3,
      ...new Vector3(...mesh[4]!).add(facingOutFromHead).toArray()
    );
    linePositions.setXYZ(4, mesh[4]![0], mesh[4]![1], mesh[4]![2]!);
    linePositions.setXYZ(
      5,
      ...new Vector3(...mesh[4]!).add(facingSidewaysFromHead).toArray()
    );
    linePositions.setXYZ(6, mesh[4]![0], mesh[4]![1], mesh[4]![2]!);

    linePositions.needsUpdate = true;
  });

  return (
    <>
      <Line
        ref={linehelper}
        geometry={new BufferGeometry().setFromPoints(
          Array.from({ length: 7 }).map(() => new Vector3())
        )}
      >
        <lineBasicMaterial color="red"></lineBasicMaterial>
      </Line>
      <group ref={line} frustumCulled={false} scale={[0.04, 0.1, 0.1]}>
        <mesh position={[0, 0, -1.5]}>
          <boxBufferGeometry></boxBufferGeometry>
          <meshNormalMaterial
            color="red"
            transparent
            opacity={1}
          ></meshNormalMaterial>
        </mesh>
      </group>
      <mesh ref={ref} geometry={maskMesh.geometry}>
        <meshNormalMaterial toneMapped={false} transparent opacity={0.4} />
      </mesh>
    </>
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
