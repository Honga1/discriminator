import React, { Suspense } from "react";
import { ARObject } from "./ARObject";
import { BoundingRectangle } from "./BoundingRectangle";
import { Dots } from "./Dots";
import { Gizmo } from "./Gizmo";
import { Mask } from "./Mask";
import { Predictions } from "../usePredictions";
import { WorldOffset } from "./WorldOffset";
import { RainbowVomit } from "./RainbowVomit";

export const Scene = ({
  predictions,
}: {
  predictions: { current: Predictions[] };
}) => {
  return (
    <WorldOffset>
      {/* <Gizmo predictions={predictions} gizmoHome={4} /> */}
      <Dots predictions={predictions}></Dots>
      <BoundingRectangle predictions={predictions}></BoundingRectangle>
      {/* <Mask predictions={predictions}></Mask> */}
      {/* <ARObject predictions={predictions} /> */}

      <Suspense fallback={null}>
        <RainbowVomit predictions={predictions}></RainbowVomit>
      </Suspense>
    </WorldOffset>
  );
};
