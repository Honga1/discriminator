import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { maskMesh, TRIANGULATION } from "./mask";
import { Predictions } from "../usePredictions";
import { V3 } from "../V3";

export const Mask = ({
  predictions,
}: {
  predictions: { current: Predictions[] };
}) => {
  const mask = useRef<Mesh>();

  useFrame(() => {
    const geometry = mask.current?.geometry;
    const prediction = predictions.current[0];
    if (geometry === undefined) return;
    if (!prediction) return;

    const mesh = prediction.scaledMesh as V3[];

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
    <mesh ref={mask} geometry={maskMesh.geometry}>
      <meshNormalMaterial toneMapped={false} transparent opacity={0.4} />
    </mesh>
  );
};
