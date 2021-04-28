import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { Predictions } from "../../../hooks/usePredictions";
import { V3 } from "../../../libs/v3";

export const ARObject = ({
  predictions,
}: {
  predictions: { current: Predictions[] };
}) => {
  const aRObject = useRef<Mesh>();

  useFrame(() => {
    const prediction = predictions.current[0];
    if (!prediction) return;
    if (!aRObject.current) return;

    const mesh = prediction.scaledMesh as V3[];
    const { up, forward } = prediction.orthoVectors;

    aRObject.current.position.set(...mesh[4]!).add(new Vector3(0, 0, 0));

    const worldPosition = new Vector3();
    aRObject.current.getWorldPosition(worldPosition);
    aRObject.current.up.copy(up);
    aRObject.current.lookAt(forward.clone().negate().add(worldPosition));
  });

  return (
    <group ref={aRObject} frustumCulled={false} scale={[0.04, 0.1, 0.1]}>
      <mesh position={[0, 0, -1.5]}>
        <boxBufferGeometry></boxBufferGeometry>
        <meshNormalMaterial
          color="red"
          transparent
          opacity={1}
        ></meshNormalMaterial>
      </mesh>
    </group>
  );
};
