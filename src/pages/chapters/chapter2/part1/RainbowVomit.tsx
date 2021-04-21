import { useFrame } from "@react-three/fiber";
import React, { useContext, useEffect, useRef } from "react";
import {
  Color,
  InstancedBufferGeometry,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  SphereBufferGeometry,
  Vector3
} from "three";
import { V3, V3O } from "../../../../libs/v3";
import { chunkMesh } from "./chunk";
import { SceneContext } from "./SceneContext";

function arrayOf<T>(creator: (index: number) => T, count: number) {
  return Array.from({ length: count }).map((_, index) => creator(index));
}

interface Particle {
  position: V3;
  velocity: V3;
  startOffset: number;
  resetAt: number;
}

const colors = [
  new Color("#ffA8F7"),
  new Color("#74B15A"),
  new Color("#F75648"),
  new Color("#00499F"),
];

function useGravityParticles({
  particleCount,
  gravity,
  duration,
  startAtObject,
  setInstance,
  afterUpdate,
  shouldReset,
}: {
  particleCount: number;
  gravity: number;
  duration: number;
  startAtObject: { current: Object3D | undefined };
  setInstance: (position: V3, index: number) => void;
  afterUpdate?: (range: number) => void;
  shouldReset?: () => boolean;
}) {
  const particles = useRef<Particle[]>();

  useFrame((context, deltaTime: number) => {
    if (!startAtObject.current) return;

    const reset = shouldReset?.() ?? false;

    const {
      direction,
      position: trackingPosition,
    } = getWorldPositionAndDirection(startAtObject.current);

    if (particles.current === undefined) {
      particles.current = arrayOf<Particle>(
        (index) => ({
          position: V3O.copy(trackingPosition),
          velocity: getVelocity(direction),
          startOffset: (index / particleCount) * duration * Math.random(),
          resetAt: 0,
        }),
        particleCount
      );
    }

    const time = context.clock.getElapsedTime();

    let positions = [];
    for (let index = 0; index < particles.current.length; index++) {
      const { velocity, position, startOffset, resetAt } = particles.current[
        index
      ]!;

      if (resetAt + startOffset > time) {
        velocity[1] += gravity * deltaTime;
        position[0] += velocity[0] * deltaTime;
        position[1] += velocity[1] * deltaTime;
        position[2] += velocity[2] * deltaTime;
        positions.push(position);
      } else if (!reset) {
        particles.current[index] = {
          ...particles.current[index]!,
          position: V3O.subtract(
            V3O.add(V3O.copy(trackingPosition), V3O.randomRange(-0.2, 0.2)),
            [0, 0.4, 0]
          ),
          velocity: getVelocity(direction),
          startOffset,
          resetAt: time,
        };
        positions.push(position);
      } else {
        particles.current[index] = {
          ...particles.current[index]!,
          position: V3O.subtract(
            V3O.add(V3O.copy(trackingPosition), V3O.randomRange(-0.2, 0.2)),
            [0, 0.4, 1.2]
          ),
          velocity: [0, 0, 0],
          startOffset,
        };
        continue;
      }

      setInstance(position, positions.length - 1);
    }

    afterUpdate?.(positions.length);
  });

  function getVelocity(direction: V3): V3 {
    return V3O.rotateAroundAxis(
      V3O.scale(
        V3O.rotateAroundAxis(direction, V3O.up(), (Math.random() - 0.5) * 0.3),
        -5
      ),
      V3O.left(),
      (Math.random() - 0.5) * 0.3
    );
  }
}

export const RainbowVomit = ({ targetAspect }: { targetAspect: number }) => {
  const aRObject = useRef<Mesh>();
  const instances = useRef<
    InstancedMesh<SphereBufferGeometry, MeshBasicMaterial>
  >();

  const vomitCount = 500;

  useTrackedObject(aRObject, targetAspect);
  const predictions = useContext(SceneContext).facemesh;

  useEffect(() => {
    if (!instances.current) return;
    for (let index = 0; index < vomitCount; index++) {
      instances.current?.setColorAt(index, colors[index % colors.length]!);
    }
    instances.current.instanceColor!.needsUpdate = true;
  });

  useGravityParticles({
    particleCount: vomitCount,
    gravity: -10,
    duration: 2,
    startAtObject: aRObject,
    setInstance: (position, index) => {
      if (!instances.current) return;
      const matrix = getMatrixFromTransform(
        position,
        [0, 0, 0],
        [0.3, 0.3, 0.3]
      );
      instances.current?.setMatrixAt(index, matrix);
    },
    afterUpdate: (range) => {
      if (!instances.current) return;
      if (!predictions.current[0]) {
        instances.current.visible = false;
      } else {
        instances.current.visible = true;
      }
      instances.current.count = range;
      instances.current.instanceMatrix.needsUpdate = true;
    },
    shouldReset: () =>
      (predictions.current[0] && predictions.current[0].mouthOpened < 0.5) ||
      false,
  });

  const args = useRef<[InstancedBufferGeometry, MeshBasicMaterial, number]>([
    new InstancedBufferGeometry().copy(chunkMesh.geometry),
    new MeshBasicMaterial({ toneMapped: false }),
    vomitCount,
  ]);

  return (
    <>
      <group ref={aRObject} frustumCulled={false}></group>
      <instancedMesh
        frustumCulled={false}
        ref={instances}
        args={args.current}
      ></instancedMesh>
    </>
  );
};

function getWorldPositionAndDirection(object: Object3D) {
  const objectPosition = new Vector3();
  object.getWorldPosition(objectPosition);

  const direction = new Vector3();
  object.getWorldDirection(direction);
  return {
    position: V3O.fromVector3(objectPosition),
    direction: V3O.fromVector3(direction),
  };
}

function useTrackedObject(
  aRObject: React.MutableRefObject<Object3D | undefined>,
  targetAspect: number
) {
  const predictions = useContext(SceneContext).facemesh;

  useFrame(({ viewport }) => {
    const prediction = predictions.current[0];
    if (!prediction) return;
    if (!aRObject.current) return;

    const mesh = prediction.mesh as V3[];
    const { up, forward } = prediction.orthoVectors;

    let scale: V3;
    if (viewport.aspect < targetAspect) {
      // Is taller than webcam aspect
      scale = [viewport.height, viewport.height / targetAspect, 1];
    } else {
      // Is wider than webcam aspect
      scale = [viewport.height * targetAspect, viewport.height, 1];
    }

    aRObject.current.position
      .set(...mesh[13]!)
      .add(new Vector3(-0.5, 0.5, 0.5))
      .multiply(new Vector3(scale[0], scale[1], 1));

    const worldPosition = new Vector3();
    aRObject.current.getWorldPosition(worldPosition);
    aRObject.current.up.copy(up);
    aRObject.current.lookAt(forward.clone().negate().add(worldPosition));
  });
}

const transformHolder = new Object3D();
transformHolder.matrixAutoUpdate = false;
function getMatrixFromTransform(
  position: V3,
  rotation: V3,
  scale: V3
): Matrix4 {
  transformHolder.position.set(...position);
  transformHolder.rotation.set(...rotation);
  transformHolder.scale.set(...scale);
  transformHolder.updateMatrix();

  return transformHolder.matrix;
}
