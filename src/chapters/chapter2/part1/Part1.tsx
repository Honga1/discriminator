import { Canvas } from "@react-three/fiber";
import React from "react";
import { useHasFirstPrediction } from "src/hooks/useHasFirstPrediction";
import { useStore } from "../../../store/store";
import { Mask } from "./Mask";
import { RainbowVomit } from "./RainbowVomit";
import { StaticBackground } from "./StaticBackground";
import { WorldOffset } from "./WorldOffset";

export const Part1 = ({
  maskType,
}: {
  maskType: "video" | "brett" | "own";
}) => {
  const hasFirstPrediction = useHasFirstPrediction();

  const webcam = useStore((state) => state.webcamHTMLElement);
  const aspect = useStore((state) => state.webcamAspect);

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
