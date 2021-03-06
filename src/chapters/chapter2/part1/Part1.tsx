import React from "react";
import { ResizeCanvas } from "src/components/ResizeCanvas";
import { WorldOffset } from "src/components/WorldOffset";
import { useHasFirstPrediction } from "src/hooks/useHasFirstPrediction";
import { useStore } from "src/store/store";
import { Mask } from "./Mask";
import { RainbowVomit } from "./RainbowVomit";
import { StaticBackground } from "../../../components/StaticBackground";

export const Part1 = ({
  maskType,
}: {
  maskType: "video" | "brett" | "own";
}) => {
  const hasFirstPrediction = useHasFirstPrediction();

  const webcam = useStore((state) => state.webcamHTMLElement);
  const aspect = useStore((state) => state.webcamAspect);

  return (
    <ResizeCanvas
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        OTransform: "scale(-1, 1)",
        transform: "scale(-1, 1)",
        pointerEvents: "none",
      }}
      orthographic={false}
      linear
    >
      <StaticBackground></StaticBackground>
      {hasFirstPrediction && aspect !== undefined && (
        <>
          <WorldOffset targetAspect={aspect}>
            <Mask
              track="center"
              maskType={maskType}
              webcam={webcam}
              loop={false}
            ></Mask>
          </WorldOffset>
          <RainbowVomit targetAspect={aspect} />
        </>
      )}
    </ResizeCanvas>
  );
};
