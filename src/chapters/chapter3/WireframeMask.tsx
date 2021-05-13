import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { usePredictions } from "src/hooks/usePredictions";
import { V3 } from "src/libs/v3";
import {
  BufferGeometry,
  IUniform,
  Mesh,
  ShaderMaterial,
  Texture,
  VideoTexture,
} from "three";
import { maskMesh, TRIANGULATION, UV_COORDS } from "../chapter2/part1/mask";

interface MaskMaterial extends ShaderMaterial {
  uniforms: {
    map: IUniform<VideoTexture | Texture | undefined>;
    alphaMap: IUniform<VideoTexture | Texture | undefined>;
  };
}

export const WireframeMask = ({ track }: { track: "center" | "webcam" }) => {
  const mask = useRef<Mesh<BufferGeometry, MaskMaterial>>();
  const predictions = usePredictions();

  useEffect(() => {
    const maskMesh = mask.current;
    if (!maskMesh) return;

    const geometry = maskMesh.geometry;

    if (geometry === undefined) return;

    const uvs = geometry.getAttribute("uv");
    TRIANGULATION.forEach((vertexIndex, index) => {
      const uv = UV_COORDS[vertexIndex];
      if (!uv) return;
      const [u, v] = uv;
      uvs.setXY(index, u, v);
    });
    uvs.needsUpdate = true;
  }, []);

  useFrame(() => {
    const geometry = mask.current?.geometry;

    const prediction = predictions.current[0];
    if (geometry === undefined) return;
    if (!prediction) return;

    let mesh: V3[];

    if (track === "center") {
      mesh = prediction.mesh as V3[];
    } else {
      mesh = prediction.scaledMesh as V3[];
    }

    const positions = geometry.getAttribute("position");
    const uvs = geometry.getAttribute("uv");
    TRIANGULATION.forEach((vertexIndex, index) => {
      const vertex = mesh[vertexIndex];
      const uv = UV_COORDS[vertexIndex];
      if (!vertex) return;
      if (!uv) return;
      const [u, v] = uv;
      const [x, y, z] = vertex;
      positions.setXYZ(index, x, y, z);

      uvs.setXY(index, u, v);
    });
    uvs.needsUpdate = true;
    positions.needsUpdate = true;
  });

  return (
    <mesh ref={mask} geometry={maskMesh.geometry}>
      <meshBasicMaterial wireframe />
    </mesh>
  );
};
