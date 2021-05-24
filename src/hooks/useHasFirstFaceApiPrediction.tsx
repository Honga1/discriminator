import { useEffect, useState } from "react";
import { FaceApiPredictionsStore } from "src/store/FaceApiPredictionsStore";
import { useFaceApiPredictions } from "./useFaceApiPredictions";

export const useHasFirstFaceApiPrediction = () => {
  useFaceApiPredictions();
  const [hasFirstPrediction, setHasFirstPrediction] = useState(
    FaceApiPredictionsStore.hasFirstFace.get()
  );

  useEffect(() => {
    return FaceApiPredictionsStore.hasFirstFace.subscribe(() => {
      setHasFirstPrediction(true);
    });
  });

  return hasFirstPrediction;
};
