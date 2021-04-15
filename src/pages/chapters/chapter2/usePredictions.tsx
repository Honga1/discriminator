import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import React, { useRef } from "react";
import { Vector3 } from "three";
import { clamp } from "../chapter3/Part1Screen2/yearsInShownOrder";
import { useAnimationFrame } from "../chapter3/useAnimationFrame";
import { useModel } from "./useModel";
import { V2 } from "./V2";
import { V3 } from "./V3";

export interface Predictions {
  scaledMesh: V3[];
  boundingBox: {
    topLeft: V2;
    bottomRight: V2;
  };

  orthoVectors: {
    up: Vector3;
    left: Vector3;
    forward: Vector3;
  };

  mouthOpened: number;
}

export function usePredictions(webcamRef: React.RefObject<HTMLVideoElement>) {
  const predictions = useRef<Predictions[]>([]);
  const model = useModel();

  useAnimationFrame(25, async () => {
    if (!webcamRef.current || !model) return;
    const video = webcamRef.current;

    if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;

    const pixelScalePredictions = await model.estimateFaces({
      input: webcamRef.current,
      returnTensors: false,
      flipHorizontal: false,
      predictIrises: false,
    });

    predictions.current = pixelScalePredictions.map((prediction) => {
      const scaledMesh = getScaledMesh(prediction, video);
      const boundingBox = getBoundingBox(prediction, video);
      const orthoVectors = getOrthoVectors(scaledMesh);

      const topHead = scaledMesh[10]!;
      const bottomHead = scaledMesh[152]!;

      const topLip = scaledMesh[12]!;
      const bottomLip = scaledMesh[15]!;

      const headSize = new Vector3(...topHead).distanceTo(
        new Vector3(...bottomHead)
      );
      const mouthGap = new Vector3(...topLip).distanceTo(
        new Vector3(...bottomLip)
      );

      const empiricalMouthOpenAmount = clamp(
        (mouthGap / headSize - 0.03) / 0.15,
        0,
        1
      );

      return {
        scaledMesh,
        boundingBox,
        orthoVectors,
        mouthOpened: empiricalMouthOpenAmount,
      };
    });
  });

  return predictions;
}
function getScaledMesh(
  prediction: AnnotatedPrediction,
  video: HTMLVideoElement
) {
  return (prediction.scaledMesh as V3[]).map(([x, y, z]) => {
    return [
      x / video.videoWidth,
      -y / video.videoHeight,
      z / video.videoWidth,
    ] as V3;
  });
}

function getBoundingBox(
  prediction: AnnotatedPrediction,
  video: HTMLVideoElement
) {
  const topLeft = [
    (prediction.boundingBox.topLeft as V2)[0] / video.videoWidth,
    -(prediction.boundingBox.topLeft as V2)[1] / video.videoHeight,
  ] as V2;
  const bottomRight = [
    (prediction.boundingBox.bottomRight as V2)[0] / video.videoWidth,
    -(prediction.boundingBox.bottomRight as V2)[1] / video.videoHeight,
  ] as V2;
  const boundingBox = {
    topLeft: topLeft,
    bottomRight: bottomRight,
  };
  return boundingBox;
}

function getOrthoVectors(mesh: V3[]) {
  const forward = getForwardVector(mesh);
  const left = getLeftVector(mesh);
  const up = getUpVector(mesh);
  return { up, forward, left };
}

function getUpVector(mesh: V3[]) {
  return new Vector3(...mesh[9]!).sub(new Vector3(...mesh[199]!)).normalize();
}

function getLeftVector(mesh: V3[]) {
  const a2 = new Vector3(...mesh[4]!);
  const b2 = new Vector3(...mesh[10]!);
  const c2 = new Vector3(...mesh[152]!);
  const side3 = new Vector3().subVectors(a2, b2);
  const side4 = new Vector3().subVectors(a2, c2);
  const facingSidewaysFromHead = new Vector3()
    .crossVectors(side3, side4)
    .normalize();
  return facingSidewaysFromHead;
}

function getForwardVector(mesh: V3[]) {
  const a = new Vector3(mesh[151]![0]!, mesh[151]![1]!, -mesh[151]![2]!);
  const b = new Vector3(mesh[285]![0]!, mesh[285]![1]!, -mesh[285]![2]!);
  const c = new Vector3(mesh[55]![0]!, mesh[55]![1]!, -mesh[55]![2]!);

  const side1 = new Vector3().subVectors(a, b);
  const side2 = new Vector3().subVectors(a, c);
  const facingOutFromHead = new Vector3()
    .crossVectors(side2, side1)
    .normalize();
  return facingOutFromHead;
}
