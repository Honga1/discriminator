import { Canvas } from "@react-three/fiber";
import React, { memo, useRef, useState } from "react";
import { useAnimationFrame } from "../../../../hooks/useAnimationFrame";
import { usePredictions } from "./../../../../hooks/usePredictions";
import { Mask } from "./Mask";
import { RainbowVomit } from "./RainbowVomit";
import { SceneContext } from "./SceneContext";
import { StaticBackground } from "./StaticBackground";
import { useWebcamAndCanvas } from "./useWebcamAndCanvas";
import { WorldOffset } from "./WorldOffset";

export const Part1 = memo(() => {
  const { webcamRef, aspect } = useWebcamAndCanvas();

  const [hasFirstPrediction, setHasFirstPrediction] = useState(false);

  useAnimationFrame(1, () => {
    if (predictions.current.length > 0 && !hasFirstPrediction) {
      setHasFirstPrediction(true);
    }
  });

  const predictions = usePredictions(webcamRef);
  return (
    <>
      <Canvas
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        orthographic={false}
      >
        <SceneContext.Provider value={{ facemesh: predictions }}>
          <StaticBackground></StaticBackground>
          {hasFirstPrediction && (
            <>
              <WorldOffset targetAspect={aspect}>
                {/* <Gizmo  gizmoHome={4} /> */}
                {/* <Dots /> */}
                {/* <BoundingRectangle /> */}
                <Mask track="center"></Mask>
                {/* <ARObject  /> */}
              </WorldOffset>
              <RainbowVomit targetAspect={aspect} />
            </>
          )}
        </SceneContext.Provider>
      </Canvas>
    </>
  );
});
