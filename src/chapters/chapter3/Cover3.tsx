import { Canvas } from "@react-three/fiber";
import { Text } from "grommet";
import React, { useEffect, useState } from "react";
import { useHasFirstPrediction } from "src/hooks/useHasFirstPrediction";
import { store, useStore } from "src/store/store";
import { Mask } from "../chapter2/part1/Mask";
import { RainbowVomit } from "../chapter2/part1/RainbowVomit";
import { StaticBackground } from "../chapter2/part1/StaticBackground";
import { WorldOffset } from "../chapter2/part1/WorldOffset";

export default function Cover3() {
  const hasFirstPrediction = useHasFirstPrediction();
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);

  const [maskType, setMaskType] = useState<"video" | "brett" | "own">("own");
  const webcam = useStore((state) => state.webcamHTMLElement);
  const aspect = useStore((state) => state.webcamAspect);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
      onClick={() =>
        setMaskType((type) =>
          type === "video" ? "brett" : type === "brett" ? "own" : "video"
        )
      }
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
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
        <div
          style={{
            position: "absolute",
            width: "100%",
            padding: "58px",
            top: 0,
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <Text
            color="yellow"
            size="32px"
            style={{
              textShadow: `0px 4px 4px rgba(0, 0, 0, 0.25)`,
            }}
          >
            Tap the screen to change your mask
          </Text>
        </div>
      </div>
    </div>
  );
}