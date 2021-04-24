import { Canvas } from "@react-three/fiber";
import React, { memo, useState } from "react";
import { useAnimationFrame } from "../../../../hooks/useAnimationFrame";
import { usePredictions } from "./../../../../hooks/usePredictions";
import { Mask } from "./Mask";
import { RainbowVomit } from "./RainbowVomit";
import { SceneContext } from "./SceneContext";
import { StaticBackground } from "./StaticBackground";
import { useWebcam } from "../../../../hooks/useWebcam";
import { WorldOffset } from "./WorldOffset";

export const Part1 = memo(() => {
  const { webcam, aspect } = useWebcam();

  const [hasFirstPrediction, setHasFirstPrediction] = useState(false);

  useAnimationFrame(1, () => {
    if (predictions.current.length > 0 && !hasFirstPrediction) {
      setHasFirstPrediction(true);
    }
  });

  const predictions = usePredictions(webcam);
  return (
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
              <Mask track="center" maskType="own" webcam={webcam}></Mask>
            </WorldOffset>
            <RainbowVomit targetAspect={aspect} />
          </>
        )}
      </SceneContext.Provider>
    </Canvas>
  );
});
