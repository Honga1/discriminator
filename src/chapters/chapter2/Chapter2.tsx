import { useThree } from "@react-three/fiber";
import { Box } from "grommet";
import React, { useEffect, useRef, useState } from "react";
import { ResizeCanvas } from "src/components/ResizeCanvas";
import { VideoPlayer } from "src/components/VideoPlayer";
import { useAsyncMemo } from "src/hooks/useAsyncMemo";
import { clamp } from "src/libs/math";
import { V2 } from "src/libs/v2";
import { V3 } from "src/libs/v3";
import { store, useStore } from "src/store/store";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Material,
  Mesh,
  ShaderMaterial,
  TextureLoader,
  VideoTexture,
} from "three";
import { useChapter } from "../../hooks/useChapter";
import deepFakeMask1 from "./deepfake-mask-1.png";
import deepFakeMask2 from "./deepfake-mask-2.png";
import deepFakeFallback from "./fallback.mp4";
import { Part1 } from "./part1/Part1";

function Part2(props: { part: string }) {
  return (
    <ResizeCanvas
      style={{
        position: "absolute",
        opacity: props.part.includes("DEEPFAKE") ? 1 : 0,
      }}
      orthographic
      linear
    >
      <DeepFakeVideoPlane
        part={
          props.part === "DEEPFAKE_1" ? 1 : props.part === "DEEPFAKE_2" ? 2 : 0
        }
      />
    </ResizeCanvas>
  );
}

export default function Chapter2() {
  const ref = useRef<HTMLVideoElement>(null);

  useChapter(ref, true);

  const [part, setPart] = useState<
    | "SCREEN_1_MASK_1"
    | "SCREEN_1_MASK_2"
    | "SCREEN_1_MASK_3"
    | "DEEPFAKE_1"
    | "DEEPFAKE_2"
    | "REST_OF_VIDEO"
  >("SCREEN_1_MASK_1");

  useEffect(() => {
    if (!ref.current) return;
    const video = ref.current;
    const onTimeUpdate = ({ nativeEvent: event }: { nativeEvent: Event }) => {
      const video = event.target as HTMLVideoElement;
      const seconds = video.currentTime;

      if (seconds > 31 && seconds < 36.5) {
        setPart("DEEPFAKE_1");
      }

      if (seconds >= 36.5 && seconds < 47) {
        setPart("DEEPFAKE_2");
      }

      if (seconds > 47) {
        setPart("REST_OF_VIDEO");
      }

      if (seconds < 25) {
        setPart("SCREEN_1_MASK_1");
      }

      if (seconds > 25 && seconds < 28) {
        setPart("SCREEN_1_MASK_2");
      }

      if (seconds > 28 && seconds < 30) {
        setPart("SCREEN_1_MASK_3");
      }
    };

    video.ontimeupdate = (event) => onTimeUpdate({ nativeEvent: event });
  }, []);

  const maskType =
    part === "SCREEN_1_MASK_1"
      ? "video"
      : part === "SCREEN_1_MASK_2"
      ? "brett"
      : "own";

  return (
    <Box
      width="100%"
      height="100%"
      justify="center"
      onClick={(event) => {
        ref.current?.click();
        event.preventDefault();
      }}
    >
      <Box
        style={{ position: "relative", width: "100%" }}
        align="center"
        overflow="hidden"
      >
        <VideoPlayer
          ref={ref}
          style={{
            boxSizing: "border-box",
            outline: "none",
            width: "100%",
            height: "100%",
          }}
          width="100%"
          height="100%"
          srcDash={`https://discriminator-media-server.jaeperris.com/part2/stream.mpd`}
          srcHls={`https://discriminator-media-server.jaeperris.com/part2/master.m3u8`}
        />
        {part !== "REST_OF_VIDEO" && <Part2 part={part} />}
      </Box>
      {part.includes("SCREEN_1") && <Part1 maskType={maskType} />}
    </Box>
  );
}

function DeepFakeVideoPlane({ part }: { part: 1 | 2 | 0 }) {
  const viewport = useThree((state) => state.viewport);
  const aspect = 16 / 9;

  const ref = useRef<Mesh<BufferGeometry, ShaderMaterial>>();
  const width = Math.min(viewport.width, viewport.height * aspect);
  const height = Math.min(viewport.width / aspect, viewport.height);

  const [video, material] = useAsyncMemo(
    async () => {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.loop = false;
      video.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        video.onerror = () => {
          video.src = deepFakeFallback;
          resolve();
        };

        video.onloadeddata = () => {
          resolve();
        };
        video.src = `https://discriminator-ai.jaeperris.com/video/${
          store.getState().session
        }.mp4`;
        video.load();
      });

      const videoTexture = new VideoTexture(video);
      const material = shaderMaterial;
      shaderMaterial.uniforms["isPartOne"] = { value: true };
      shaderMaterial.uniforms["map"] = { value: videoTexture };
      shaderMaterial.uniforms["alphaMapTwo"] = {
        value: new TextureLoader().load(deepFakeMask2),
      };
      shaderMaterial.uniforms["alphaMapOne"] = {
        value: new TextureLoader().load(deepFakeMask1),
      };

      return [video, material] as [
        HTMLVideoElement | undefined,
        Material | undefined
      ];
    },
    [],
    [undefined, undefined]
  );

  useEffect(() => {
    video?.play();
    if (!ref.current) return;
    ref.current.material.uniforms["isPartOne"]!.value = part === 1;
    ref.current.material.uniformsNeedUpdate = true;
  }, [part, video]);

  const sourceElement = useStore((state) => state.chapter?.element);
  const startOffset = 31;

  useEffect(() => {
    if (sourceElement && video) {
      const onSeeked = (event: Event): void => {
        video.play();
        video.currentTime = clamp(
          (sourceElement.currentTime ?? 0) - startOffset,
          0,
          video.duration || 0
        );
      };
      const onPlay = (event: Event): void => {
        video.currentTime = clamp(
          (sourceElement.currentTime ?? 0) - startOffset,
          0,
          video.duration || 0
        );
        video.play();
      };
      const onPause = (event: Event): void => {
        video.currentTime = clamp(
          (sourceElement.currentTime ?? 0) - startOffset,
          0,
          video.duration || 0
        );
        video.pause();
      };

      video.addEventListener("ended", onPause);
      sourceElement.addEventListener("timeupdate", onSeeked);
      sourceElement.addEventListener("seeked", onSeeked);
      sourceElement.addEventListener("play", onPlay);
      sourceElement.addEventListener("pause", onPause);

      return () => {
        video.removeEventListener("ended", onPause);
        sourceElement.removeEventListener("seeked", onSeeked);
        sourceElement.removeEventListener("timeupdate", onSeeked);
        sourceElement.removeEventListener("play", onPlay);
        sourceElement.removeEventListener("pause", onPause);
      };
    }
  }, [sourceElement, video]);

  const [deepFakeAspect, setDeepFakeAspect] = useState(
    video === undefined ? 4 / 3 : video.videoWidth / video.videoHeight || 4 / 3
  );
  useEffect(() => {
    if (!video) return;
    const onLoadedMetaData = () => {
      setDeepFakeAspect(video.videoWidth / video.videoHeight || 4 / 3);
    };
    video.addEventListener("loadedmetadata", onLoadedMetaData);
    setDeepFakeAspect(video.videoWidth / video.videoHeight || 4 / 3);
    return () => video.removeEventListener("loadedmetadata", onLoadedMetaData);
  }, [video]);

  useEffect(() => {
    const geometry = ref.current?.geometry;

    if (!geometry) return;
    if (part === 0) {
      geometry.scale(0, 0, 0);
    } else if (part === 1) {
      geometry.scale(1, 1, 1);
      const topLeft: V3 = [794, -609, 0];
      const topRight: V3 = [961, -620, 0];
      const bottomRight: V3 = [959, -739, 0];
      const bottomLeft: V3 = [789, -726, 0];

      const points = [topLeft, topRight, bottomLeft, bottomRight];

      const center = points.reduce(
        (acc, curr, index, array) =>
          [
            acc[0] + curr[0] / array.length,
            acc[1] + curr[1] / array.length,
          ] as V2,
        [0, 0] as [totalX: number, totalY: number]
      );

      const offsetFromCenter: V3[] = points.map((point) => [
        point[0] - center[0],
        point[1] - center[1],
        point[2],
      ]);

      const xs = offsetFromCenter.map((point) => point[0]);
      const ys = offsetFromCenter.map((point) => point[1]);

      const width = Math.max(...xs) - Math.min(...xs);
      const height = Math.max(...ys) - Math.min(...ys);
      const targetHeight = width / deepFakeAspect;

      const correctedAspect: V3[] = offsetFromCenter.map((point) => [
        point[0],
        (point[1] / height) * targetHeight,
        point[2],
      ]);

      const replacedInCenter: V3[] = correctedAspect.map((point) => [
        point[0] + center[0],
        point[1] + center[1],
        point[2],
      ]);

      const vertices: number[] = replacedInCenter.flat();

      geometry.setAttribute(
        "position",
        new Float32BufferAttribute(vertices, 3)
      );
    } else {
      geometry.scale(1, 1, 1);

      const topLeft: V3 = [470, -180, 0];
      const topRight: V3 = [1311, -261, 0];
      const bottomRight: V3 = [1281, -954, 0];
      const bottomLeft: V3 = [427, -854, 0];

      const points = [topLeft, topRight, bottomLeft, bottomRight];

      const yOffset = 220;
      const scale = 1.5;

      const offsetY: V3[] = points.map((point) => [
        point[0],
        point[1] + yOffset,
        point[2],
      ]);

      const center = offsetY.reduce(
        (acc, curr, index, array) =>
          [
            acc[0] + curr[0] / array.length,
            acc[1] + curr[1] / array.length,
          ] as V2,
        [0, 0] as [totalX: number, totalY: number]
      );

      const offsetFromCenter: V3[] = offsetY.map((point) => [
        point[0] - center[0],
        point[1] - center[1],
        point[2],
      ]);

      const scaledFromCenter: V3[] = offsetFromCenter.map((point) => [
        point[0] * scale,
        point[1] * scale,
        point[2],
      ]);

      const xs = scaledFromCenter.map((point) => point[0]);
      const ys = scaledFromCenter.map((point) => point[1]);

      const width = Math.max(...xs) - Math.min(...xs);
      const height = Math.max(...ys) - Math.min(...ys);
      const targetHeight = width / deepFakeAspect;

      const correctedAspect: V3[] = scaledFromCenter.map((point) => [
        point[0],
        (point[1] / height) * targetHeight,
        point[2],
      ]);

      const replacedInCenter: V3[] = correctedAspect.map((point) => [
        point[0] + center[0],
        point[1] + center[1],
        point[2],
      ]);

      const vertices: number[] = replacedInCenter.flat();

      geometry.setAttribute(
        "position",
        new Float32BufferAttribute(vertices, 3)
      );
    }
    geometry.getAttribute("position").needsUpdate = true;
  }, [deepFakeAspect, part]);

  return (
    <group scale={[width, height, 1]}>
      <group scale={[1 / 1920, 1 / 1080, 1]} position={[-0.5, 0.5, 0]}>
        {material && (
          <mesh ref={ref}>
            <planeBufferGeometry />
            <primitive attach="material" object={material} />
          </mesh>
        )}
      </group>
    </group>
  );
}

const vertexShader = /* glsl */ `
varying vec2 vUv;
varying vec2 vScreenUv;
uniform mat3 uvTransform;
void main() {

	#include <uv_vertex>

	vec3 transformed = vec3( position );
  vUv = uv.xy;
  vec4 mvPosition = vec4( transformed, 1.0 );
  mvPosition = modelViewMatrix * mvPosition;
  gl_Position = projectionMatrix * mvPosition;

  vec2 aspectCorrection = vec2(1.0, 9.0/16.0);
  vScreenUv = (gl_Position.xy + 1.0) / 2.0;

  // set height to correct aspect


}
`;

const fragmentShader = /* glsl */ `
varying vec2 vUv;
uniform sampler2D map;
uniform sampler2D alphaMapOne;
uniform sampler2D alphaMapTwo;
varying vec2 vScreenUv;
uniform bool isPartOne;

void main() {
  vec4 texelColor = texture2D( map, vUv);
  vec4 maskOne = texture2D( alphaMapOne, vScreenUv);
  vec4 maskTwo = texture2D( alphaMapTwo, vScreenUv);
  vec4 mask = mix(maskOne, maskTwo, isPartOne ? 0.0 : 1.0);
  gl_FragColor = vec4(texelColor.rgb, 1.0 - mask.a);
}
`;

const shaderMaterial = new ShaderMaterial({
  fragmentShader,
  vertexShader,
  transparent: true,
});
