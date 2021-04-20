import { useFrame } from "@react-three/fiber";
import React, { useContext, useRef } from "react";
import { Mesh, ShaderMaterial, sRGBEncoding, VideoTexture } from "three";
import maskSrc from "../mask.mp4";
import { V3 } from "../V3";
import { maskMesh, TRIANGULATION, UV_COORDS } from "./mask";
import { SceneContext } from "./SceneContext";

const video = document.createElement("video");
video.src = maskSrc;
video.muted = true;
video.loop = true;
video.play();
const texture = new VideoTexture(video);
texture.encoding = sRGBEncoding;

export const Mask = () => {
  const mask = useRef<Mesh>();
  const predictions = useContext(SceneContext).facemesh;

  console.log(mask.current?.geometry.getAttribute("uv").array.length! / 2);
  console.log(UV_COORDS.length);
  console.log(TRIANGULATION.length);
  console.log(Math.max(...TRIANGULATION));
  useFrame(() => {
    const geometry = mask.current?.geometry;

    const prediction = predictions.current[0];
    if (geometry === undefined) return;
    if (!prediction) return;

    const mesh = prediction.scaledMesh as V3[];
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
    // texture.needsUpdate = true;
    uvs.needsUpdate = true;
    positions.needsUpdate = true;
    // geometry.computeVertexNormals();
    // (mask.current!
    // .material as ShaderMaterial).uniforms!.map!.value.needsUpdate = true;
  });

  return (
    <mesh ref={mask} geometry={maskMesh.geometry}>
      <shaderMaterial
        fragmentShader={frag}
        vertexShader={vert}
        transparent
        uniforms={{ map: { value: texture } }}
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
const vec3 alphaColor = vec3(0.898, 0.898, 0.898);

void main() {
	vec4 texelColor = texture2D( map, vUv );
  if ( distance(alphaColor, texelColor.rgb) < 0.05 ) discard;
  gl_FragColor = texelColor;
}
`;
