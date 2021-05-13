import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import { Predictions } from "src/store/PredictionsStore";
import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from "three";
import { Line2 } from "three-stdlib";
import { V3 } from "../../../libs/v3";

export const Gizmo = ({
  predictions,
  gizmoHome = 4,
}: {
  predictions: { current: Predictions[] };
  gizmoHome?: number;
}) => {
  const gizmo = useRef<Line2>(null);
  // const points = 7;
  const line = useLineWithPoints(7);

  useFrame(() => {
    const prediction = predictions.current[0];
    const linePositions = gizmo.current?.geometry.getAttribute("position");
    if (!prediction || !linePositions) return;
    const mesh = prediction.scaledMesh as V3[];

    const {
      up,
      forward: facingOutFromHead,
      left: facingSidewaysFromHead,
    } = prediction.orthoVectors;

    // Tip of nose
    const home = mesh[gizmoHome]!;
    const homeUp = new Vector3(...home).add(up).toArray();
    const homeOut = new Vector3(...home).add(facingOutFromHead).toArray();
    const homeSide = new Vector3(...home).add(facingSidewaysFromHead).toArray();

    linePositions.setXYZ(0, ...home);
    linePositions.setXYZ(1, ...homeUp);
    linePositions.setXYZ(2, ...home);
    linePositions.setXYZ(3, ...homeOut);
    linePositions.setXYZ(4, ...home);
    linePositions.setXYZ(5, ...homeSide);
    linePositions.setXYZ(6, ...home);

    linePositions.needsUpdate = true;
  });
  // return (
  //   <DreiLine
  //     ref={gizmo}
  //     color={"red"}
  //     points={points}
  //     frustumCulled={false}
  //   ></DreiLine>
  // );
  return <primitive ref={gizmo} object={line} />;
};

function useLineWithPoints(points: number) {
  return useMemo(() => {
    const geo = new BufferGeometry().setFromPoints(
      Array.from({ length: points }).map(() => new Vector3())
    );
    const material = new LineBasicMaterial({ color: "red" });
    const mesh = new Line(geo, material);

    return mesh;
  }, [points]);
}
