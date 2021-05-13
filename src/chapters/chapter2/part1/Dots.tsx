import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { usePredictions } from "src/hooks/usePredictions";
import { BufferAttribute, BufferGeometry } from "three";
import { V3 } from "../../../libs/v3";

export function Dots() {
  const ref = useRef<BufferGeometry>();
  const predictions = usePredictions();

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
