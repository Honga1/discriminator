import { Canvas } from "@react-three/fiber";
import React, { memo, Suspense, useRef, useState } from "react";
import { useAnimationFrame } from "../../../../hooks/useAnimationFrame";
import { useStore } from "../../../../store/store";
import { usePredictions } from "./../../../../hooks/usePredictions";
import { Mask } from "./Mask";
import { RainbowVomit } from "./RainbowVomit";
import { SceneContext } from "./SceneContext";
import { StaticBackground } from "./StaticBackground";
import { useWebcamAndCanvas } from "./useWebcamAndCanvas";
import { WorldOffset } from "./WorldOffset";

export const Part1 = memo(
  ({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement> }) => {
    const webcamRef = useRef<HTMLVideoElement>(null);

    const webcamStream = useStore((state) => state.webcamStream);

    const [canvasWidth, canvasHeight] = useWebcamAndCanvas(
      webcamRef,
      videoRef,
      webcamStream
    );

    const [hasFirstPrediction, setHasFirstPrediction] = useState(false);

    useAnimationFrame(1, () => {
      if (predictions.current.length > 0 && !hasFirstPrediction) {
        setHasFirstPrediction(true);
      }
    });

    const predictions = usePredictions(webcamRef);
    return (
      <>
        <video
          style={{
            position: "absolute",
            boxSizing: "border-box",
            outline: "none",
            width: canvasWidth + "px",
            height: canvasHeight + "px",
            opacity: 0.5,
            top: "50%",
            transform: "translateY(-50%)",
          }}
          ref={webcamRef}
        ></video>
        <Canvas
          style={{
            position: "absolute",
            width: canvasWidth + "px",
            height: canvasHeight + "px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
          orthographic={false}
        >
          <SceneContext.Provider value={{ facemesh: predictions }}>
            <StaticBackground></StaticBackground>
            {hasFirstPrediction && (
              <>
                <WorldOffset>
                  {/* <Gizmo  gizmoHome={4} /> */}
                  {/* <Dots /> */}
                  {/* <BoundingRectangle /> */}
                  <Mask track="center"></Mask>
                  {/* <ARObject  /> */}
                </WorldOffset>
                <Suspense fallback={null}>
                  <RainbowVomit />
                </Suspense>
              </>
            )}
          </SceneContext.Provider>
        </Canvas>
      </>
    );
  }
);
