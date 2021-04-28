import { useFrame } from "@react-three/fiber";
import React, { useContext, useRef } from "react";
import { Mesh } from "three";
import { V2 } from "../../../libs/v2";
import { SceneContext } from "./SceneContext";

export function BoundingRectangle() {
  const ref = useRef<Mesh>();

  const predictions = useContext(SceneContext).facemesh;

  useFrame(() => {
    if (predictions.current.length <= 0) return;
    if (!ref.current) return;

    const topLeft = predictions.current[0]!.boundingBox.topLeft as V2;
    const bottomRight = predictions.current[0]!.boundingBox.bottomRight! as V2;

    const centerX = (topLeft[0] + bottomRight[0]) / 2;
    const centerY = (topLeft[1] + bottomRight[1]) / 2;

    const width = bottomRight[0] - topLeft[0];
    const height = bottomRight[1] - topLeft[1];

    ref.current.scale.setX(width);
    ref.current.scale.setY(height);
    ref.current.position.setX(centerX);
    ref.current.position.setY(centerY);
  });

  return (
    <mesh ref={ref} frustumCulled={false}>
      <planeBufferGeometry />
      <meshBasicMaterial color={"red"} transparent opacity={0.2} />
    </mesh>
  );
}
