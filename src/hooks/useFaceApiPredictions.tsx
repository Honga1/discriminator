import { useEffect, useRef, useState } from "react";
import {
  FaceApiPrediction,
  FaceApiPredictionsStore,
} from "src/store/FaceApiPredictionsStore";
import { useStore } from "src/store/store";

export function useFaceApiPredictions() {
  const predictions = useRef<FaceApiPrediction | undefined>();
  const webcam = useStore((state) => state.webcamHTMLElement);

  useEffect(() => {
    return FaceApiPredictionsStore.subscribe(webcam, (incoming) => {
      predictions.current = incoming;
    });
  }, [webcam]);

  return predictions;
}

export function useStatefulApiPredictions() {
  const [predictions, setPredictions] =
    useState<FaceApiPrediction | undefined>();
  const webcam = useStore((state) => state.webcamHTMLElement);

  useEffect(() => {
    return FaceApiPredictionsStore.subscribe(webcam, (incoming) => {
      setPredictions(incoming);
    });
  }, [webcam]);

  return predictions;
}
