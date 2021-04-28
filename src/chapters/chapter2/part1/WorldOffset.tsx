import React, { PropsWithChildren } from "react";
import { useThree } from "@react-three/fiber";
import { V3 } from "../../../libs/v3";

/**
 * Makes world scale 0-1, and position 0-1 for width and height
 */
export const WorldOffset = ({
  children,
  targetAspect,
}: PropsWithChildren<{ targetAspect: number }>) => {
  const { viewport } = useThree();

  let scale: V3;
  if (viewport.aspect < targetAspect) {
    // Is taller than webcam aspect
    scale = [viewport.height, viewport.height / targetAspect, 1];
  } else {
    // Is wider than webcam aspect
    scale = [viewport.height * targetAspect, viewport.height, 1];
  }
  return (
    <group scale={scale} position={[-scale[0] / 2, scale[1] / 2, 0]}>
      {children}
    </group>
  );
};
