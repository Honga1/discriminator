import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs";
import * as faceapi from "@vladmandic/face-api/dist/face-api.esm-nobundle.js";
import {
  FaceDetection,
  FaceExpressions,
  FaceLandmarks68,
  Gender,
} from "@vladmandic/face-api";
import { makeObservable } from "./makeObservable";

export interface FaceApiPrediction {
  age: number;
  alignedRect: FaceDetection;
  angle: {
    roll: number | undefined;
    pitch: number | undefined;
    yaw: number | undefined;
  };
  descriptor: Float32Array;
  detection: FaceDetection;
  expressions: FaceExpressions;
  gender: Gender;
  genderProbability: number;
  landmarks: FaceLandmarks68;
  unshiftedLandmarks: FaceLandmarks68;
}

export class FaceApiPredictionsStore {
  private static predictions =
    makeObservable<FaceApiPrediction | undefined>(undefined);
  private static modelPromise: undefined | Promise<void[]>;
  private static webcam: undefined | HTMLVideoElement;
  private static isUpdating = false;
  static hasFirstFace = makeObservable(false);
  static isPaused = false;
  static pauseFor = async (duration: number) => {
    console.log("FaceAPI Predictions paused");
    FaceApiPredictionsStore.isPaused = true;
    await new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
    console.log("FaceAPI Predictions resumed");
    FaceApiPredictionsStore.isPaused = false;
  };

  static update = async () => {
    FaceApiPredictionsStore.isUpdating = false;
    if (FaceApiPredictionsStore.predictions.listeners.size === 0) return;
    if (FaceApiPredictionsStore.modelPromise === undefined) {
      console.log("Loading FaceAPI model");

      FaceApiPredictionsStore.modelPromise = Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(
          "https://discriminator-media-server.jaeperris.com/models"
        ),
        faceapi.nets.ageGenderNet.loadFromUri(
          "https://discriminator-media-server.jaeperris.com/models"
        ),
        faceapi.nets.faceExpressionNet.loadFromUri(
          "https://discriminator-media-server.jaeperris.com/models"
        ),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(
          "https://discriminator-media-server.jaeperris.com/models"
        ),
        faceapi.nets.faceRecognitionNet.loadFromUri(
          "https://discriminator-media-server.jaeperris.com/models"
        ),
      ]);
      console.log("Loaded FaceAPI model");
    }
    if (FaceApiPredictionsStore.webcam === undefined) return;
    const webcam = FaceApiPredictionsStore.webcam;

    FaceApiPredictionsStore.isUpdating = true;

    if (FaceApiPredictionsStore.isPaused)
      return requestAnimationFrame(FaceApiPredictionsStore.update);

    if (webcam.readyState < HTMLMediaElement.HAVE_METADATA)
      return requestAnimationFrame(FaceApiPredictionsStore.update);

    await FaceApiPredictionsStore.modelPromise;

    const rawPrediction: FaceApiPrediction | undefined = await faceapi
      .detectSingleFace(webcam, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks(true)
      .withFaceExpressions()
      .withAgeAndGender()
      .withFaceDescriptor();

    FaceApiPredictionsStore.hasFirstFace.set(true);

    const predictions = rawPrediction;

    FaceApiPredictionsStore.predictions.set(predictions);

    requestAnimationFrame(FaceApiPredictionsStore.update);
  };

  static subscribe = (
    webcam: HTMLVideoElement,
    listener: (value: FaceApiPrediction | undefined) => void
  ) => {
    const unsubscribe = FaceApiPredictionsStore.predictions.subscribe(listener);
    console.log(
      `Added FaceApi subscriber, have ${FaceApiPredictionsStore.predictions.listeners.size} listeners`
    );
    FaceApiPredictionsStore.webcam = webcam;
    if (!FaceApiPredictionsStore.isUpdating) FaceApiPredictionsStore.update();
    return () => {
      console.log("Removing FaceApi subscriber");
      return unsubscribe();
    };
  };

  static get = FaceApiPredictionsStore.predictions.get;
}
