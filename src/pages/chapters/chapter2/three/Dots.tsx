import { useFrame } from "@react-three/fiber";
import React, { useContext, useRef } from "react";
import { BufferAttribute, BufferGeometry } from "three";
import { V3 } from "../V3";
import { SceneContext } from "./SceneContext";

export function Dots() {
  const ref = useRef<BufferGeometry>();
  const predictions = useContext(SceneContext).facemesh;
  useFrame(() => {
    if (predictions.current.length <= 0) return;
    const landmarks = predictions.current[0]!.scaledMesh as V3[];
    const positions3d = landmarks.flat();
    ref.current?.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(positions3d), 3)
    );
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry ref={ref}></bufferGeometry>
      <pointsMaterial color="#20BF00" size={0.08} />
    </points>
  );
}
