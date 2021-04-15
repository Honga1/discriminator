import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BufferAttribute, BufferGeometry } from "three";
import { Predictions } from "../usePredictions";
import { V3 } from "../V3";

export function Dots({
  predictions,
}: {
  predictions: { current: Predictions[] };
}) {
  const ref = useRef<BufferGeometry>();
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
