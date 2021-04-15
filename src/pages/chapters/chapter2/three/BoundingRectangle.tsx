import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { Predictions } from "../usePredictions";
import { V2 } from "../V2";

export function BoundingRectangle({
  predictions,
}: {
  predictions: { current: Predictions[] };
}) {
  const ref = useRef<Mesh>();

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
      <meshNormalMaterial color={"red"} transparent opacity={0.1} />
    </mesh>
  );
}
