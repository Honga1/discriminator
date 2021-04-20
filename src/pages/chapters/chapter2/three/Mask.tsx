import { useFrame } from "@react-three/fiber";
import React, { useContext, useEffect, useRef } from "react";
import {
  BufferGeometry,
  IUniform,
  Mesh,
  ShaderMaterial,
  sRGBEncoding,
  VideoTexture,
} from "three";
import maskSrc from "../mask.mp4";
import alphaSrc from "../alpha.mp4";
import { V3 } from "../V3";
import { maskMesh, TRIANGULATION, UV_COORDS } from "./mask";
import { SceneContext } from "./SceneContext";

interface MaskMaterial extends ShaderMaterial {
  uniforms: {
    map: IUniform<VideoTexture | undefined>;
    alphaMap: IUniform<VideoTexture | undefined>;
  };
}

export const Mask = () => {
  const mask = useRef<Mesh<BufferGeometry, MaskMaterial>>();
  const predictions = useContext(SceneContext).facemesh;

  useEffect(() => {
    const maskMesh = mask.current;
    if (!maskMesh) return;
    const mapVideo = document.createElement("video");
    mapVideo.src = maskSrc;
    mapVideo.muted = true;

    const alphaMapVideo = document.createElement("video");
    alphaMapVideo.src = alphaSrc;
    alphaMapVideo.muted = true;

    const map = new VideoTexture(mapVideo);
    const alphaMap = new VideoTexture(alphaMapVideo);

    map.encoding = sRGBEncoding;
    alphaMap.encoding = sRGBEncoding;

    mapVideo.play();
    alphaMapVideo.play();

    maskMesh.material.uniforms.map.value = map;
    maskMesh.material.uniforms.alphaMap.value = alphaMap;

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

    return () => {
      if (maskMesh) {
        maskMesh.material.uniforms.map.value = undefined;
        maskMesh.material.uniforms.alphaMap.value = undefined;
      }
      mapVideo.remove();
      alphaMapVideo.remove();
      map.dispose();
      alphaMap.dispose();
    };
  }, []);

  useFrame(() => {
    const geometry = mask.current?.geometry;

    const prediction = predictions.current[0];
    if (geometry === undefined) return;
    if (!prediction) return;

    const mesh = prediction.mesh as V3[];
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
      <shaderMaterial
        fragmentShader={frag}
        vertexShader={vert}
        transparent
        uniforms={{ map: { value: undefined }, alphaMap: { value: undefined } }}
      />
    </mesh>
  );
};

const vert = /* glsl */ `
varying vec2 vUv;
uniform mat3 uvTransform;

void main() {

	#include <uv_vertex>

	vec3 transformed = vec3( position );
  vUv = uv.xy;
  vec4 mvPosition = vec4( transformed, 1.0 );
  mvPosition = modelViewMatrix * mvPosition;
  gl_Position = projectionMatrix * mvPosition;

}
`;

const frag = /* glsl */ `
varying vec2 vUv;
uniform sampler2D map;
uniform sampler2D alphaMap;

void main() {
  vec2 invertedUv = vec2(vUv.x, 1.0 - vUv.y);
	vec4 texelColor = texture2D( map, invertedUv );
  vec4 alphaColor = texture2D( alphaMap, invertedUv);
  gl_FragColor = vec4(texelColor.rgb, alphaColor.r);
}
`;
