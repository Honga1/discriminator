import { Suspense } from "react";
import { Predictions } from "../usePredictions";
import { BoundingRectangle } from "./BoundingRectangle";
import { Dots } from "./Dots";
import { Mask } from "./Mask";
import { RainbowVomit } from "./RainbowVomit";
import { SceneContext } from "./SceneContext";
import { WorldOffset } from "./WorldOffset";

(function () {
  var script = document.createElement("script");
  script.onload = function () {
    // @ts-ignore
    var stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = "//cdn.jsdelivr.net/gh/Kevnz/stats.js/build/stats.min.js";
  document.head.appendChild(script);
})();

export const Scene = ({
  predictions,
}: {
  predictions: { current: Predictions[] };
}) => {
  return (
    <SceneContext.Provider value={{ facemesh: predictions }}>
      <WorldOffset>
        {/* <Gizmo  gizmoHome={4} /> */}
        {/* <Dots /> */}
        {/* <BoundingRectangle /> */}
        <Mask></Mask>
        {/* <ARObject  /> */}

        <Suspense fallback={null}>
          <RainbowVomit />
        </Suspense>
      </WorldOffset>
    </SceneContext.Provider>
  );
};
