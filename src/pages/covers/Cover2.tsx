import { Canvas } from "@react-three/fiber";
import React, { useEffect } from "react";
import { store } from "../../store/store";
import { StaticBackground } from "../chapters/chapter2/part1/StaticBackground";

export default function Cover2() {
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);

  return (
    <Canvas
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: "50%",
        transform: "translateY(-50%)",
      }}
      orthographic={false}
    >
      <StaticBackground></StaticBackground>
    </Canvas>
  );
}
