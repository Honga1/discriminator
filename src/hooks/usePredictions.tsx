import { useEffect, useRef } from "react";
import { Predictions, PredictionsStore } from "src/store/PredictionsStore";
import { useStore } from "src/store/store";

export function usePredictions() {
  const predictions = useRef<Predictions[]>([]);
  const webcam = useStore((state) => state.webcamHTMLElement);

  useEffect(() => {
    return PredictionsStore.subscribe(webcam, (incoming) => {
      predictions.current = incoming;
    });
  }, [webcam]);

  return predictions;
}
