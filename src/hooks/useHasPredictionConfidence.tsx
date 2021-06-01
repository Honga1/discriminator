import { useEffect, useState } from "react";
import { PredictionsStore } from "src/store/PredictionsStore";
import { useStore } from "src/store/store";

export const useHasPredictionConfidence = () => {
  const [isConfident, setIsConfident] = useState(false);
  const webcam = useStore((state) => state.webcamHTMLElement);

  useEffect(() => {
    return PredictionsStore.subscribe(webcam, (incoming) => {
      setIsConfident((incoming[0] && incoming[0].confidence > 0.8) ?? false);
    });
  }, [webcam]);

  return isConfident;
};
