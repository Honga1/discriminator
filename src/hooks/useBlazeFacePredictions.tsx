import * as blazeface from "@tensorflow-models/blazeface";
import React, { useRef } from "react";
import { Vector2 } from "three";
import { useAnimationFrame } from "./useAnimationFrame";
import { BoundingBox } from "../libs/BoundingBox";
import { useAsyncMemo } from "./useAsyncMemo";
import { V2 } from "../libs/v2";

export interface BlazeFacePredictions {
  keyPoints: V2[];
  boundingBox: BoundingBox;

  orthoVectors: {
    up: Vector2;
    left: Vector2;
  };
}

export function useBlazeFacePredictions(
  webcamRef: React.RefObject<HTMLVideoElement>
) {
  const predictions = useRef<BlazeFacePredictions[]>([]);
  const model = useModel();

  useAnimationFrame(60, async () => {
    if (!webcamRef.current || !model) return;
    const video = webcamRef.current;

    if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;

    const pixelScalePredictions = await model.estimateFaces(
      webcamRef.current,
      false
    );

    predictions.current = pixelScalePredictions.map((prediction) => {
      const keyPoints = getScaledKeyPoints(prediction, video);
      const boundingBox = getBoundingBox(prediction, video);
      const orthoVectors = getOrthoVectors(keyPoints);

      return {
        keyPoints,
        boundingBox,
        orthoVectors,
      };
    });
  });

  return predictions;
}
function getScaledKeyPoints(
  predictions: blazeface.NormalizedFace,
  video: HTMLVideoElement
) {
  return (predictions.landmarks as V2[]).map(([x, y]) => {
    return [x / video.videoWidth, -y / video.videoHeight] as V2;
  });
}

function getBoundingBox(
  prediction: blazeface.NormalizedFace,
  video: HTMLVideoElement
) {
  const topLeft = [
    (prediction.topLeft as V2)[0] / video.videoWidth,
    -(prediction.topLeft as V2)[1] / video.videoHeight,
  ] as V2;
  const bottomRight = [
    (prediction.bottomRight as V2)[0] / video.videoWidth,
    -(prediction.bottomRight as V2)[1] / video.videoHeight,
  ] as V2;
  const boundingBox = {
    topLeft: topLeft,
    bottomRight: bottomRight,
  };
  return boundingBox;
}
// landmarks: [
//   [295.13, 177.64], // right eye
//   [382.32, 175.56], // left eye
//   [341.18, 205.03], // nose
//   [345.12, 250.61], // mouth
//   [252.76, 211.37], // right ear
//   [431.20, 204.93] // left ear
// ]

function getOrthoVectors(keyPoints: V2[]) {
  const left = getLeftVector(keyPoints);
  const up = getUpVector(keyPoints);
  return { up, left };
}

function getUpVector(keyPoints: V2[]) {
  return new Vector2(...keyPoints[2]!)
    .sub(new Vector2(...keyPoints[3]!))
    .normalize();
}

function getLeftVector(keyPoints: V2[]) {
  return new Vector2(...keyPoints[4]!)
    .sub(new Vector2(...keyPoints[5]!))
    .normalize();
}

function useModel() {
  return useAsyncMemo(
    async () => {
      console.log("Loading model");
      const model = await blazeface.load({ maxFaces: 1 });
      console.log("Loaded model");
      return model;
    },
    [],
    undefined
  );
}
