import React, { useEffect } from "react";
import { store, useStore } from "../store/store";

export default function Cover2() {
  const isFirstPredictionComplete = useStore(
    (state) => state.isFirstPredictionComplete
  );
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        // width: "100%",
        // height: "100%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        left: "50%",
      }}
    >
      {!isFirstPredictionComplete ? "LOADING" : "COMPLETE"}
    </div>
  );
}
