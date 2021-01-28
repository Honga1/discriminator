import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import {
  AnnotatedPrediction,
  MediaPipeFaceMesh,
} from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import {
  Coord2D,
  Coords3D,
} from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import { Video } from "grommet";
import {
  forwardRef,
  MutableRefObject,
  ReactElement,
  useEffect,
  useRef,
} from "react";
import { useOverrideAnimationFrame } from "../../hooks/useAnimationFrame";
import { useForwardedRef } from "../../hooks/useForwardedRef";

export const VideoDetector = forwardRef<
  HTMLVideoElement,
  {
    stream: MediaStream;
    results: MutableRefObject<IKeyPoints | undefined>;
  }
>(
  ({ stream, results }, ref): ReactElement => {
    const videoRef = useForwardedRef(ref);
    const hasLoadedData = useRef(false);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      video.play();
      video.addEventListener("loadeddata", () => {
        hasLoadedData.current = true;
      });
    }, [stream, videoRef]);

    useEffect(() => {
      const main = async () => {
        const video = videoRef.current;
        if (video === null || hasLoadedData.current === false) return;
        video.width = stream.getTracks()[0]!.getSettings().width!;
        video.height = stream.getTracks()[0]!.getSettings().height!;
        const keyPoints = await getKeyPoints(video);

        if (keyPoints) results.current = keyPoints;
      };

      main();
    }, [results, stream, videoRef]);

    useOverrideAnimationFrame(25, async () => {
      const main = async () => {
        const video = videoRef.current;
        if (video === null || hasLoadedData.current === false) return;
        video.width = stream.getTracks()[0]!.getSettings().width!;
        video.height = stream.getTracks()[0]!.getSettings().height!;

        const keyPoints = await getKeyPoints(video);
        if (keyPoints) results.current = keyPoints;
      };

      main();
    });
    return <Video ref={videoRef as any}></Video>;
  }
);

interface PartLocations {
  LEFT_EYE: Coords3D;
  RIGHT_EYE: Coords3D;
  MOUTH: Coords3D;
  NOSE: Coords3D;
  FACE_PLANE: Coords3D;
  NOSE_TIP: Coords3D;
  SILHOUETTE: Coords3D;
}

interface PlaneDescriptor {
  normal: Coord3D;
  offset: number;
  zRotation: number;
}

export interface KeyPoints<T extends HTMLImageElement | HTMLVideoElement> {
  source: T;
  parts: PartLocations;
  mesh: Coords3D;
  scaledMesh: Coords3D;
  normalizedMesh: Coords3D;
  sourceAspect: number;
  facePlane: PlaneDescriptor;
  boundingBox: BoundingBox;
}

type Coord3D = [number, number, number];

export interface BoundingBox {
  topLeft: Coord2D;
  bottomRight: Coord2D;
}

export interface IKeyPoints {
  source: HTMLVideoElement;
  faceInViewConfidence: number;
  boundingBox: BoundingBox;
  normalizedBoundingBox: BoundingBox;
  mesh: Coords3D;
  /** Facial landmark coordinates normalized to input dimensions. */
  scaledMesh: Coords3D;
  /** Facial landmark coordinates normalized to 0-1 */
  normalizedMesh: Coords3D;
  aspect: number;
}
let model: MediaPipeFaceMesh | undefined = undefined;
let pendingPromise: Promise<MediaPipeFaceMesh> | undefined;
async function loadModelIfNeeded(model: MediaPipeFaceMesh | undefined) {
  if (pendingPromise === undefined) {
    const result = faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      { maxFaces: 1, shouldLoadIrisModel: false }
    );
    pendingPromise = result;
  }
  return await pendingPromise;
}

export async function getKeyPoints(
  input: HTMLVideoElement
): Promise<IKeyPoints | undefined> {
  model = await loadModelIfNeeded(model);

  const predictions = await model.estimateFaces({
    input,
    returnTensors: false,
    predictIrises: false,
  });

  const firstFacePrediction = predictions[0] as
    | (AnnotatedPrediction & {
        kind: "MediaPipePredictionValues";
      })
    | undefined;

  if (firstFacePrediction === undefined) return undefined;

  const inputDimensions = getInputDimensions(input);

  const { scaledMesh } = firstFacePrediction;

  const normalizedMesh: Coords3D = getNormalizedMesh(
    scaledMesh,
    inputDimensions
  );

  const normalizedBoundingBox = getNormalizedBoundingBox(
    firstFacePrediction.boundingBox,
    inputDimensions
  );

  const keyPoints: IKeyPoints = {
    ...firstFacePrediction,
    source: input,
    normalizedMesh,
    aspect: inputDimensions.aspect,
    normalizedBoundingBox,
  };

  return keyPoints;
}
function getInputDimensions(input: HTMLVideoElement) {
  return {
    width: input.videoWidth,
    height: input.videoHeight,
    aspect: input.videoWidth / input.videoHeight,
  };
}
function getNormalizedBoundingBox(
  boundingBox: BoundingBox,
  inputDimensions: { width: number; height: number }
): BoundingBox {
  return {
    topLeft: [
      boundingBox.topLeft[0] / inputDimensions.width,
      boundingBox.topLeft[1] / inputDimensions.height,
    ],
    bottomRight: [
      boundingBox.bottomRight[0] / inputDimensions.width,
      boundingBox.bottomRight[1] / inputDimensions.height,
    ],
  };
}

function getNormalizedMesh(
  scaledMesh: Coords3D,
  inputDimensions: { width: number; height: number }
): Coords3D {
  const normalizedMesh: Coords3D = [];

  for (let index = 0; index < scaledMesh.length; index++) {
    const [x, y, z] = scaledMesh[index]!;
    normalizedMesh.push([
      x / inputDimensions.width,
      -y / inputDimensions.height,
      z / inputDimensions.width,
    ]);
  }

  return normalizedMesh;
}
