import { useEffect, useState } from "react";
import { PredictionsStore } from "src/store/PredictionsStore";

export const useHasFirstPrediction = () => {
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
