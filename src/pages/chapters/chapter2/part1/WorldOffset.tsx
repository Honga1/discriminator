import React, { PropsWithChildren } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Makes world scale 0-1, and position 0-1 for width and height
 */
export const WorldOffset = ({ children }: PropsWithChildren<{}>) => {
  const { viewport } = useThree();

  return (
    <group
      scale={[viewport.width, viewport.height, 1]}
      position={[-viewport.width / 2, viewport.height / 2, 0]}
    >
      {children}
    </group>
  );
};
