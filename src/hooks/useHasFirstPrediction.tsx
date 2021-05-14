import { useEffect, useState } from "react";
import { PredictionsStore } from "src/store/PredictionsStore";
import { usePredictions } from "./usePredictions";

export const useHasFirstPrediction = () => {
  usePredictions();
  const [hasFirstPrediction, setHasFirstPrediction] = useState(
    PredictionsStore.hasFirstFace.get()
  );

  useEffect(() => {
    return PredictionsStore.hasFirstFace.subscribe(() => {
      setHasFirstPrediction(true);
    });
  });

  return hasFirstPrediction;
};
