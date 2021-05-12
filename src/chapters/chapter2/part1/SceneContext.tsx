import React, { createContext } from "react";
import { Predictions } from "../../../hooks/usePredictions";

export const SceneContext = createContext<{
  facemesh: React.MutableRefObject<Predictions[]>;
  aspect: number | undefined;
  webcam: HTMLVideoElement | undefined;
}>({
  facemesh: { current: [] },
  aspect: undefined,
  webcam: undefined,
});
