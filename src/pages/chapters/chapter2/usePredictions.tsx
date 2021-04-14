import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import React, { useRef } from "react";
import { useAnimationFrame } from "../chapter3/useAnimationFrame";
import { useModel } from "./useModel";
import { V3, V2 } from "../Chapter2";

export function usePredictions(webcamRef: React.RefObject<HTMLVideoElement>) {
  const predictions = useRef<AnnotatedPrediction[]>([]);
  const model = useModel();

  useAnimationFrame(60, async () => {
    if (!webcamRef.current || !model) return;
    const video = webcamRef.current;

    if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;

    const pixelScalePredictions = await model.estimateFaces({
      input: webcamRef.current,
      returnTensors: false,
      flipHorizontal: false,
      predictIrises: false,
    });

    predictions.current = pixelScalePredictions.map(
      (prediction) =>
        ({
          ...prediction,
          scaledMesh: (prediction.scaledMesh as V3[]).map(([x, y, z]) => {
            return [
              x / video.videoWidth,
              -y / video.videoHeight,
              z / video.videoWidth,
            ] as V3;
          }),
          boundingBox: {
            topLeft: [
              (prediction.boundingBox.topLeft as V2)[0] / video.videoWidth,
              -(prediction.boundingBox.topLeft as V2)[1] / video.videoHeight,
            ],
            bottomRight: [
              (prediction.boundingBox.bottomRight as V2)[0] / video.videoWidth,
              -(prediction.boundingBox.bottomRight as V2)[1] /
                video.videoHeight,
            ],
          },
        } as AnnotatedPrediction)
    );
  });

  return predictions;
}
