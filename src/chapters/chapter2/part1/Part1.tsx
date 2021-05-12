import { Canvas } from "@react-three/fiber";
import React, { useContext, useState } from "react";
import { useAnimationFrame } from "../../../hooks/useAnimationFrame";
import { store } from "../../../store/store";
import { Mask } from "./Mask";
import { RainbowVomit } from "./RainbowVomit";
import { SceneContext } from "./SceneContext";
import { StaticBackground } from "./StaticBackground";
import { WorldOffset } from "./WorldOffset";
import { useContextBridge } from "@react-three/drei";

export const Part1 = ({
  maskType,
}: {
  maskType: "video" | "brett" | "own";
}) => {
  const [hasFirstPrediction, setHasFirstPrediction] = useState(false);

  const { facemesh: predictions, aspect, webcam } = useContext(SceneContext);

  useAnimationFrame(1, () => {
    if (predictions.current.length > 0 && !hasFirstPrediction) {
      setHasFirstPrediction(true);
      store.setState({ isFirstPredictionComplete: true });
    }
  });

  const ContextBridge = useContextBridge(SceneContext);

  return (
    <Canvas
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
      orthographic={false}
    >
      <ContextBridge>
        <StaticBackground></StaticBackground>
        {hasFirstPrediction && aspect !== undefined && webcam !== undefined && (
          <>
            <WorldOffset targetAspect={aspect}>
              <Mask track="center" maskType={maskType} webcam={webcam}></Mask>
            </WorldOffset>
            <RainbowVomit targetAspect={aspect} />
          </>
        )}
      </ContextBridge>
    </Canvas>
  );
};
