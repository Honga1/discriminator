import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { LoopRepeat, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { Predictions } from "../usePredictions";
import { V3 } from "../V3";
import vomitModel from "./vomit.gltf";

export const RainbowVomit = ({
  predictions,
}: {
  predictions: { current: Predictions[] };
}) => {
  const aRObject = useRef<Mesh>();

  const { nodes, materials, animations } = useGLTF(vomitModel);

  const { ref, mixer, names, actions, clips } = useAnimations(animations);

  useEffect(() => {
    const action = actions.Action;
    if (!action) return;
    action.loop = LoopRepeat;
    action.play();

    if ((nodes?.Cube as Mesh | undefined)?.material) {
      (nodes.Cube as Mesh).material = new MeshBasicMaterial({ color: "red" });
    }
  });

  useFrame(() => {
    const prediction = predictions.current[0];
    if (!prediction) return;
    if (!aRObject.current) return;

    const mesh = prediction.scaledMesh as V3[];
    const { up, forward } = prediction.orthoVectors;

    aRObject.current.position.set(...mesh[13]!).add(new Vector3(0, 0, 0));

    const worldPosition = new Vector3();
    aRObject.current.getWorldPosition(worldPosition);
    aRObject.current.up.copy(up);
    aRObject.current.lookAt(forward.clone().negate().add(worldPosition));

    if (ref.current) {
      ref.current.visible = prediction.mouthOpened > 0.5;
    }
  });

  return (
    <group ref={aRObject} frustumCulled={false} scale={[0.04, 0.1, 0.1]}>
      <group ref={ref} rotation={[0, Math.PI / 2, 0]} position={[0, 0, 3]}>
        <primitive object={nodes.Cube} />
      </group>

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
