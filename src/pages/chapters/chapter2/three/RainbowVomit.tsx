import { useFrame } from "@react-three/fiber";
import React, { useContext, useRef } from "react";
import {
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereBufferGeometry,
  Vector3,
} from "three";
import { V3 } from "../V3";
import { SceneContext } from "./SceneContext";

const geometry = new SphereBufferGeometry(0.2);
const material = new MeshBasicMaterial({ color: "red" });

export const RainbowVomit = () => {
  const aRObject = useRef<Mesh>();
  const instances = useRef<
    InstancedMesh<SphereBufferGeometry, MeshBasicMaterial>
  >();

  const vomitCount = 100;

  const positions = useRef<V3[]>(
    Array.from({ length: vomitCount }).map((_, index) => [
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() * index,
    ])
  );
  const velocities = useRef<V3[]>(
    Array.from({ length: vomitCount }).map((_, index) => [
      Math.random() - 0.5,
      Math.random() + 0.1,
      Math.random() + 1.0,
    ])
  );

  const predictions = useContext(SceneContext).facemesh;

  useFrame((context, deltaTime) => {
    const prediction = predictions.current[0];
    if (!prediction) return;
    if (!aRObject.current) return;

    const mesh = prediction.mesh as V3[];
    const { up, forward } = prediction.orthoVectors;

    aRObject.current.position.set(...mesh[13]!).add(new Vector3(0, 0, 0));

    const worldPosition = new Vector3();
    aRObject.current.getWorldPosition(worldPosition);
    aRObject.current.up.copy(up);
    aRObject.current.lookAt(forward.clone().negate().add(worldPosition));

    if (!instances.current) return;

    if (prediction.mouthOpened > 0.5) {
      if (instances.current.visible === false) {
        for (let index = 0; index < vomitCount; index++) {
          positions.current[index]! = [
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random(),
          ];
        }
      }
      instances.current.visible = true;
      for (let index = 0; index < vomitCount; index++) {
        const position = positions.current[index]!;
        const velocity = velocities.current[index]!;
        positions.current[index]! = [
          position[0] - 2 * deltaTime * velocity[0],
          position[1] + (10 * deltaTime * velocity[1]) ** 2,
          position[2] - 30 * deltaTime * velocity[2],
        ];

        if (positions.current[index]![2] < -100) {
          positions.current[index]! = [
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random(),
          ];
        }

        const matrix = getMatrixFromTransform(position, 0, [1, 1]);
        instances.current?.setMatrixAt(index, matrix);
      }
    } else {
      instances.current.visible = false;
    }

    instances.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={aRObject} frustumCulled={false} scale={[0.1, 0.1, 0.1]}>
      <instancedMesh
        ref={instances}
        args={[geometry, material, vomitCount]}
      ></instancedMesh>
    </group>
  );
};

const transformHolder = new Object3D();
transformHolder.matrixAutoUpdate = false;
function getMatrixFromTransform(
  position: V3,
  rotation: number,
  scale: [x: number, y: number]
): Matrix4 {
  transformHolder.position.set(...position);
  transformHolder.rotation.set(0, 0, rotation);
  transformHolder.scale.set(scale[0], scale[1], 1);
  transformHolder.updateMatrix();

  return transformHolder.matrix;
}
