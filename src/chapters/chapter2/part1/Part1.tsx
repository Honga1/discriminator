import { Canvas } from "@react-three/fiber";
import React, { useState } from "react";
import { usePredictions } from "src/hooks/usePredictions";
import { useAnimationFrame } from "../../../hooks/useAnimationFrame";
import { store, useStore } from "../../../store/store";
import { Mask } from "./Mask";
import { RainbowVomit } from "./RainbowVomit";
import { StaticBackground } from "./StaticBackground";
import { WorldOffset } from "./WorldOffset";

export const Part1 = ({
  maskType,
}: {
  maskType: "video" | "brett" | "own";
}) => {
  const [hasFirstPrediction, setHasFirstPrediction] = useState(false);

  const webcam = useStore((state) => state.webcamHTMLElement);
  const aspect = useStore((state) => state.webcamAspect);
  const predictions = usePredictions();

  useAnimationFrame(1, () => {
    if (predictions.current.length > 0 && !hasFirstPrediction) {
      setHasFirstPrediction(true);
      store.setState({ isFirstPredictionComplete: true });
    }
  });

  return (
    <Canvas
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
      orthographic={false}
    >
      <StaticBackground></StaticBackground>
      {hasFirstPrediction && aspect !== undefined && (
        <>
          <WorldOffset targetAspect={aspect}>
            <Mask track="center" maskType={maskType} webcam={webcam}></Mask>
          </WorldOffset>
          <RainbowVomit targetAspect={aspect} />
        </>
      )}
    </Canvas>
  );
};
