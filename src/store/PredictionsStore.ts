import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import {
  AnnotatedPrediction,
  MediaPipeFaceMesh,
} from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import "@tensorflow/tfjs-backend-webgl";
import { clamp } from "src/libs/math";
import { V2 } from "src/libs/v2";
import { V3 } from "src/libs/v3";
import { Vector3 } from "three";
import { makeObservable } from "./makeObservable";

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
  eyesOpened: boolean;
  confidence: number;
}

export class PredictionsStore {
  private static predictions = makeObservable<Predictions[]>([]);
  private static modelPromise: undefined | Promise<MediaPipeFaceMesh>;
  private static webcam: undefined | HTMLVideoElement;
  private static isUpdating = false;
  static hasFirstFace = makeObservable(false);
  static isPaused = false;
  static pauseFor = async (duration: number) => {
    console.log("Predictions paused");
    PredictionsStore.isPaused = true;
    await new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
    console.log("Predictions resumed");
    PredictionsStore.isPaused = false;
  };

  static update = async () => {
    PredictionsStore.isUpdating = false;
    if (PredictionsStore.predictions.listeners.size === 0) return;
    if (PredictionsStore.modelPromise === undefined) {
      console.log("Loading model");
      PredictionsStore.modelPromise = facemesh.load(
        facemesh.SupportedPackages.mediapipeFacemesh,
        {
          shouldLoadIrisModel: true,
          maxFaces: 1,
        }
      );
      console.log("Loaded model");
    }
    if (PredictionsStore.webcam === undefined) return;
    const webcam = PredictionsStore.webcam;

    PredictionsStore.isUpdating = true;

    if (PredictionsStore.isPaused)
      return requestAnimationFrame(PredictionsStore.update);

    if (webcam.readyState < HTMLMediaElement.HAVE_METADATA)
      return requestAnimationFrame(PredictionsStore.update);

    const rawPrediction = await (
      await PredictionsStore.modelPromise
    ).estimateFaces({
      input: webcam,
      returnTensors: false,
      flipHorizontal: false,
      predictIrises: true,
    });

    PredictionsStore.hasFirstFace.set(true);

    const predictions = rawPrediction.map((prediction) => {
      const scaledMesh = getScaledMesh(prediction, webcam);
      const mesh = getMesh(prediction, webcam);
      const boundingBox = getBoundingBox(prediction, webcam);
      const orthoVectors = getOrthoVectors(mesh);
      const mouthOpened = getMouthPosition(mesh);
      const eyesOpened = areEyesOpen(mesh);

      return {
        scaledMesh,
        boundingBox,
        orthoVectors,
        mouthOpened,
        mesh,
        eyesOpened,
        confidence: prediction.faceInViewConfidence,
      };
    });

    PredictionsStore.predictions.set(predictions);

    requestAnimationFrame(PredictionsStore.update);
  };

  static subscribe = (
    webcam: HTMLVideoElement,
    listener: (value: Predictions[]) => void
  ) => {
    const unsubscribe = PredictionsStore.predictions.subscribe(listener);
    console.log(
      `Added subscriber, have ${PredictionsStore.predictions.listeners.size} listeners`
    );
    PredictionsStore.webcam = webcam;
    if (!PredictionsStore.isUpdating) PredictionsStore.update();
    return () => {
      console.log("Removing subscriber");
      return unsubscribe();
    };
  };

  static get = PredictionsStore.predictions.get;
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

function areEyesOpen(scaledMesh: V3[]) {
  const topLeftEyelid = scaledMesh[159]!;
  const bottomLeftEyelid = scaledMesh[145]!;

  const leftEyeLeftCrease = scaledMesh[33]!;
  const leftEyeRightCrease = scaledMesh[133]!;

  const topRightEyelid = scaledMesh[386]!;
  const bottomRightEyelid = scaledMesh[374]!;

  const rightEyeLeftCrease = scaledMesh[362]!;
  const rightEyeRightCrease = scaledMesh[263]!;

  const leftEyeWidth = new Vector3(...leftEyeLeftCrease).distanceTo(
    new Vector3(...leftEyeRightCrease)
  );

  const rightEyeWidth = new Vector3(...rightEyeLeftCrease).distanceTo(
    new Vector3(...rightEyeRightCrease)
  );

  const leftEyeOpenGap = new Vector3(...bottomLeftEyelid).distanceTo(
    new Vector3(...topLeftEyelid)
  );
  const rightEyeOpenGap = new Vector3(...bottomRightEyelid).distanceTo(
    new Vector3(...topRightEyelid)
  );

  const empiricalLeftEyeOpenAmount = clamp(
    leftEyeOpenGap / (leftEyeWidth * 2),
    0,
    1
  );
  const empiricalRightEyeOpenAmount = clamp(
    rightEyeOpenGap / (rightEyeWidth * 2),
    0,
    1
  );

  return (
    empiricalLeftEyeOpenAmount > 0.11 && empiricalRightEyeOpenAmount > 0.11
  );
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
