import { Text } from "grommet";
import React, { useEffect, useState } from "react";
import { ResizeCanvas } from "src/components/ResizeCanvas";
import { WorldOffset } from "src/components/WorldOffset";
import { useCoverAudio } from "src/hooks/useCoverAudio";
import { useHasFirstPrediction } from "src/hooks/useHasFirstPrediction";
import { store, useStore } from "src/store/store";
import { Mask } from "../chapter2/part1/Mask";
import { RainbowVomit } from "../chapter2/part1/RainbowVomit";
import { StaticBackground } from "../chapter2/part1/StaticBackground";

export default function Cover3() {
  const hasFirstPrediction = useHasFirstPrediction();
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);

  useCoverAudio(3);

  const hasWebcamStream = useStore((state) => state.webcamStream !== undefined);

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
        <ResizeCanvas
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            OTransform: "scale(-1, 1)",
            transform: "scale(-1, 1)",
          }}
          linear
          orthographic={false}
        >
          <StaticBackground></StaticBackground>
          {hasFirstPrediction && aspect !== undefined && (
            <>
              <WorldOffset targetAspect={aspect}>
                <Mask
                  track="center"
                  maskType={maskType}
                  webcam={webcam}
                  loop={true}
                ></Mask>
              </WorldOffset>
              <RainbowVomit targetAspect={aspect} />
            </>
          )}
        </ResizeCanvas>
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
            {!hasWebcamStream
              ? ""
              : !hasFirstPrediction
              ? "Loading..."
              : "Tap the screen to change your mask"}
          </Text>
        </div>
      </div>
    </div>
  );
}
