import { useFrame } from "@react-three/fiber";
import React, { useContext, useRef } from "react";
import { Mesh } from "three";
import { V3 } from "../V3";
import { maskMesh, TRIANGULATION } from "./mask";
import { SceneContext } from "./SceneContext";

export const Mask = () => {
  const mask = useRef<Mesh>();
  const predictions = useContext(SceneContext).facemesh;

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
      positions.setXYZ(index, x, y, z);
    });

    positions.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={mask} geometry={maskMesh.geometry}>
      <meshNormalMaterial toneMapped={false} transparent opacity={1} />
    </mesh>
  );
};
