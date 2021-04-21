import React, { createContext } from "react";
import { Predictions } from "../../../../hooks/usePredictions";

export const SceneContext = createContext<{
  facemesh: React.MutableRefObject<Predictions[]>;
}>({
  facemesh: { current: [] },
});
