import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import * as Fili from "fili";
import { useCallback, useRef } from "react";
import { Vector3 } from "three";
import { useAnimationFrame } from "../hooks/useAnimationFrame";
import { clamp } from "../libs/math";
import { V2 } from "../libs/v2";
import { V3 } from "../libs/v3";
import { useAsyncMemo } from "./useAsyncMemo";

export interface Predictions {
  scaledMesh: V3[];
  mesh: V3[];
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

export function usePredictions(webcam: HTMLVideoElement) {
  const predictions = useRef<Predictions[]>([]);
  const model = useModel();
  const filters = useRef<any[][]>([]);

  const iirFilterCoeffs = useRef(
    new Fili.CalcCascades().lowpass({
      order: 3,
      characteristic: "butterworth",
      Fs: 30,
      Fc: 6,
      BW: 1,
      gain: 0,
      preGain: false,
    })
  );

  const updatePredictions = useCallback(async () => {
    if (!model) return;
    const video = webcam;

    if (video.readyState < HTMLMediaElement.HAVE_METADATA) return;

    const pixelScalePredictions = await model.estimateFaces({
      input: webcam,
      returnTensors: false,
      flipHorizontal: false,
      predictIrises: false,
    });

    predictions.current = pixelScalePredictions.map(
      (prediction, predictionIndex) => {
        const scaledMesh = getScaledMesh(prediction, video);
        const mesh = getMesh(prediction, video).map(([x, y, z], meshIndex) => {
          const vertexFilters = filters.current[predictionIndex]?.[
            meshIndex
          ] ?? [
            new Fili.IirFilter(iirFilterCoeffs.current),
            new Fili.IirFilter(iirFilterCoeffs.current),
            new Fili.IirFilter(iirFilterCoeffs.current),
          ];

          filters.current[predictionIndex] =
            filters.current[predictionIndex] ?? [];

          filters.current[predictionIndex]![meshIndex] = vertexFilters;

          return [
            vertexFilters[0].singleStep(x),
            vertexFilters[1].singleStep(y),
            vertexFilters[2].singleStep(z),
          ] as V3;
        });
        const boundingBox = getBoundingBox(prediction, video);
        const orthoVectors = getOrthoVectors(mesh);
        const mouthOpened = getMouthPosition(mesh);

        return {
          scaledMesh,
          boundingBox,
          orthoVectors,
          mouthOpened,
          mesh,
        };
      }
    );
  }, [model, webcam]);

  useAnimationFrame(30, updatePredictions);

  return predictions;
}
function getMouthPosition(scaledMesh: V3[]) {
  const topHead = scaledMesh[10]!;
  const bottomHead = scaledMesh[152]!;

  const topLip = scaledMesh[12]!;
  const bottomLip = scaledMesh[15]!;

  const headSize = new Vector3(...topHead).distanceTo(
    new Vector3(...bottomHead)
  );
  const mouthGap = new Vector3(...topLip).distanceTo(new Vector3(...bottomLip));

  const empiricalMouthOpenAmount = clamp(
    (mouthGap / headSize - 0.03) / 0.15,
    0,
    1
  );
  return empiricalMouthOpenAmount;
}

function getScaledMesh(
  prediction: AnnotatedPrediction,
  video: HTMLVideoElement
) {
  return (prediction.scaledMesh as V3[]).map(([x, y, z]) => {
    return [
      x / video.videoWidth,
      -y / video.videoHeight,
      -z / video.videoWidth,
    ] as V3;
  });
}

function getMesh(prediction: AnnotatedPrediction, video: HTMLVideoElement) {
  const aspect = video.videoWidth / video.videoHeight;
  if (video.videoHeight > video.videoWidth) {
    return (prediction.mesh as V3[]).map(([x, y, z]) => {
      return [x / 192, (-y / 192) * aspect, -z / 192] as V3;
    });
  } else {
    return (prediction.mesh as V3[]).map(([x, y, z]) => {
      const correctedX = (x - 192 / 2) / 192 / aspect + 0.5;
      return [correctedX, -y / 192, -z / 192] as V3;
    });
  }
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
  return new Vector3(...mesh[199]!).sub(new Vector3(...mesh[9]!)).normalize();
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
  const a = new Vector3(mesh[151]![0]!, mesh[151]![1]!, mesh[151]![2]!);
  const b = new Vector3(mesh[285]![0]!, mesh[285]![1]!, mesh[285]![2]!);
  const c = new Vector3(mesh[55]![0]!, mesh[55]![1]!, mesh[55]![2]!);

  const side1 = new Vector3().subVectors(a, b);
  const side2 = new Vector3().subVectors(a, c);
  const facingOutFromHead = new Vector3()
    .crossVectors(side2, side1)
    .normalize();
  return facingOutFromHead;
}

const modelPromise = facemesh.load(
  facemesh.SupportedPackages.mediapipeFacemesh,
  {
    shouldLoadIrisModel: false,
    maxFaces: 1,
  }
);

export function useModel() {
  return useAsyncMemo(
    async () => {
      console.log("Loading model");
      const model = await modelPromise;

      console.log("Loaded model");
      return model;
    },
    [],
    undefined
  );
}
