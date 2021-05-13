import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import { usePredictions } from "src/hooks/usePredictions";
import {
  BufferGeometry,
  IUniform,
  Mesh,
  ShaderMaterial,
  sRGBEncoding,
  Texture,
  TextureLoader,
  Vector2,
  VideoTexture,
} from "three";
import { V3 } from "../../../libs/v3";
import alphaSrc from "./alpha.mp4";
import brettMaskAlpha from "./brett-mask-alpha.png";
import brettMaskMap from "./brett-mask-map.png";
import { maskMesh, TRIANGULATION, UV_COORDS } from "./mask";
import maskSrc from "./mask.mp4";

interface MaskMaterial extends ShaderMaterial {
  uniforms: {
    map: IUniform<VideoTexture | Texture | undefined>;
    alphaMap: IUniform<VideoTexture | Texture | undefined>;
  };
}

export const Mask = ({
  track,
  maskType,
  webcam,
}: {
  webcam: HTMLVideoElement;
  track: "center" | "webcam";
  maskType: "brett" | "own" | "video";
}) => {
  const textures = useMemo(() => {
    const mapVideo = document.createElement("video");
    mapVideo.src = maskSrc;
    mapVideo.muted = true;

    const alphaMapVideo = document.createElement("video");
    alphaMapVideo.src = alphaSrc;
    alphaMapVideo.muted = true;

    const videoMaskMap = new VideoTexture(mapVideo);
    const videoMaskAlpha = new VideoTexture(alphaMapVideo);

    videoMaskMap.encoding = sRGBEncoding;
    videoMaskAlpha.encoding = sRGBEncoding;

    mapVideo.play();
    alphaMapVideo.play();

    const webcamTexture = new VideoTexture(webcam);

    const brettsFaceAlbedo = new TextureLoader().load(brettMaskMap);
    const brettsFaceAlpha = new TextureLoader().load(brettMaskAlpha);

    return {
      video: { alpha: videoMaskAlpha, albedo: videoMaskMap },
      own: { albedo: webcamTexture, alpha: brettsFaceAlpha },
      brett: { albedo: brettsFaceAlbedo, alpha: brettsFaceAlpha },
    };
  }, [webcam]);

  const mask = useRef<Mesh<BufferGeometry, MaskMaterial>>();
  const predictions = usePredictions();
  const maskTexture = textures[maskType];

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

    if (maskType === "own") {
      maskTexture.albedo.center = new Vector2(mesh[4]![0], mesh[4]![1]);
    }

    const { topLeft, bottomRight } = prediction.boundingBox;

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

      if (maskType === "own") {
        // Correct for head rotation and center position
        const nextU =
          (u + mesh[4]![0] - 0.5) * (bottomRight[0] - topLeft[0]) + topLeft[0];
        const nextV = v * (topLeft[1] - bottomRight[1]) - topLeft[1];
        uvs.setXY(index, nextU, nextV);
      } else {
        uvs.setXY(index, u, v);
      }
    });
    uvs.needsUpdate = true;
    positions.needsUpdate = true;
  });

  return (
    <mesh ref={mask} geometry={maskMesh.geometry}>
      <primitive
        object={maskMaterial}
        attach="material"
        uniforms-map-value={maskTexture.albedo}
        uniforms-alphaMap-value={maskTexture.alpha}
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

const maskMaterial = new ShaderMaterial({
  fragmentShader: frag,
  vertexShader: vert,
  transparent: true,
  uniforms: {
    map: { value: undefined },
    alphaMap: { value: undefined },
  },
});
