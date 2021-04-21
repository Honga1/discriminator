import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import { useAsyncMemo } from "./useAsyncMemo";

export function useModel() {
  return useAsyncMemo(
    async () => {
      console.log("Loading model");
      const model = await facemesh.load(
        facemesh.SupportedPackages.mediapipeFacemesh,
        {
          shouldLoadIrisModel: false,
          maxFaces: 1,
        }
      );

      console.log("Loaded model");
      return model;
    },
    [],
    undefined
  );
}
