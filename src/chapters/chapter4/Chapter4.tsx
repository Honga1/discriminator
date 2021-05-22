import { useContextBridge } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Box, Grid, ResponsiveContext, ThemeContext } from "grommet";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ResizeCanvas } from "src/components/ResizeCanvas";
import { VideoPlayer } from "src/components/VideoPlayer";
import { useChapter } from "src/hooks/useChapter";
import { useFaceApiPredictions } from "src/hooks/useFaceApiPredictions";
import { useStore } from "src/store/store";
import { colorTheme } from "src/theme";
import {
  BufferGeometry,
  Mesh,
  PlaneBufferGeometry,
  ShaderMaterial,
  Vector4,
  VideoTexture,
} from "three";
import { SquareDiv } from "../chapter3/components/SquareDiv";
import { AIInfo } from "./AIInfo";

export default function Chapter4() {
  const ref = useRef<HTMLVideoElement>(null);
  useChapter(ref, true);

  const [part, setPart] = useState<"VIDEO" | "INTERACTIVE">("VIDEO");

  useEffect(() => {
    if (!ref.current) return;
    const video = ref.current;
    const onTimeUpdate = ({ nativeEvent: event }: { nativeEvent: Event }) => {
      const video = event.target as HTMLVideoElement;
      const seconds = Math.round(video.currentTime);

      if (seconds < 64) {
        setPart("VIDEO");
      } else if (seconds < 119) {
        setPart("INTERACTIVE");
      } else {
        setPart("VIDEO");
      }
    };

    video.ontimeupdate = (event) => onTimeUpdate({ nativeEvent: event });
  }, []);

  const ContextBridge = useContextBridge(ThemeContext, ResponsiveContext);
  const isSmall = useContext(ResponsiveContext) === "small";

  return (
    <Box
      style={{ position: "relative", width: "100%", height: "100%" }}
      overflow="hidden"
      flex={false}
    >
      {part !== "VIDEO" && (
        <Box
          flex={false}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          pad={{ horizontal: "20px", vertical: "48px" }}
          justify="center"
          align="center"
        >
          {isSmall ? (
            <Grid
              style={{ height: "100%", width: "100%" }}
              rows={["min-content", "auto"]}
              columns={["auto"]}
              justify="center"
              gap="24px"
            >
              <Box
                style={{
                  maxWidth: "300px",
                  maxHeight: "300px",
                  width: "66vw",
                  height: "66vw",
                }}
              >
                <SquareDiv
                  style={{
                    border: `3px solid ${colorTheme.greenLight}`,
                    boxSizing: "border-box",
                  }}
                >
                  <ResizeCanvas
                    linear
                    orthographic
                    style={{ width: "100%", height: "100%" }}
                  >
                    <ContextBridge>
                      <WebcamPlane />
                    </ContextBridge>
                  </ResizeCanvas>
                </SquareDiv>
              </Box>
              <Box align="center">
                <AIInfo />
              </Box>
            </Grid>
          ) : (
            <Grid
              style={{ width: "100%", maxWidth: "800px" }}
              rows={["auto"]}
              columns={["auto", "min-content"]}
              gap="59px"
            >
              <Box style={{ position: "relative", height: "100%" }}>
                <Box
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <SquareDiv
                    style={{
                      border: `3px solid ${colorTheme.greenLight}`,
                      boxSizing: "border-box",
                    }}
                  >
                    <ResizeCanvas
                      linear
                      orthographic
                      style={{ width: "100%", height: "100%" }}
                    >
                      <ContextBridge>
                        <WebcamPlane />
                      </ContextBridge>
                    </ResizeCanvas>
                  </SquareDiv>
                </Box>
              </Box>
              <Box justify="start">
                <AIInfo />
              </Box>
            </Grid>
          )}
        </Box>
      )}

      <VideoPlayer
        ref={ref}
        style={{
          boxSizing: "border-box",
          outline: "none",
          width: "100%",
          height: "100%",
          opacity: part === "INTERACTIVE" ? "0" : "1",
          userSelect: "none",
        }}
        width="100%"
        height="100%"
        srcDash={`https://discriminator-media-server.jaeperris.com/part4/stream.mpd`}
        srcHls={`https://discriminator-media-server.jaeperris.com/part4/master.m3u8`}
        hidden
      ></VideoPlayer>
    </Box>
  );
}

function WebcamPlane() {
  const webcam = useStore((state) => state.webcamHTMLElement);
  const viewport = useThree((state) => state.viewport);

  const videoTexture = useMemo(() => {
    return new VideoTexture(webcam);
  }, [webcam]);

  const predictions = useFaceApiPredictions();

  useFrame(() => {
    if (topLeft.current && predictions.current !== undefined) {
      const { x, y, width, height } = predictions.current.detection.relativeBox;

      const maxAxis = Math.max(width, height);

      const aspect = width / height;
      const centerX = x + width / 2;
      const moveCameraUp = (height / 2) * 0.3;
      const centerY = y + (height / 2 - moveCameraUp);

      let left;
      let top;
      let right;
      let bottom;

      const zoomOutFactor = 1.5;
      // Cover fit
      if (aspect < 1) {
        left = centerX - (width / 2) * zoomOutFactor;
        top = centerY - (maxAxis / 2) * zoomOutFactor;
        right = centerX + (width / 2) * zoomOutFactor;
        bottom = centerY + (maxAxis / 2) * zoomOutFactor;
      } else {
        left = centerX - (maxAxis / 2) * zoomOutFactor;
        top = centerY - (height / 2) * zoomOutFactor;
        right = centerX + (maxAxis / 2) * zoomOutFactor;
        bottom = centerY + (height / 2) * zoomOutFactor;
      }

      const uniform = topLeft.current.material.uniforms["boundingBox"]!.value;

      uniform.x = left;
      uniform.y = bottom;
      uniform.z = right;
      uniform.w = top;
    }
  });

  const topLeft = useRef<Mesh<PlaneBufferGeometry, ShaderMaterial>>();
  return (
    <mesh scale={[viewport.width, viewport.height, 1]} ref={topLeft}>
      <planeBufferGeometry />
      <primitive
        object={facePlaneMaterial}
        attach="material"
        uniforms-map-value={videoTexture}
        uniforms-boundingBox-value={new Vector4(0.2, 0.8, 0.8, 0.2)}
      />
    </mesh>
  );
}

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
uniform vec4 boundingBox;

void main() {
  vec2 topLeft = boundingBox.xy;
  vec2 bottomRight = boundingBox.zw;
  vec2 dimensions = bottomRight - topLeft;
  vec2 uv = vUv * dimensions + topLeft;
  vec2 invertedUv = clamp(vec2(uv.x, 1.0 - uv.y), vec2(0), vec2(1));
  
	vec4 texelColor = texture2D( map, invertedUv );
  gl_FragColor = vec4(texelColor.rgb,1.0);
}
`;

const facePlaneMaterial = new ShaderMaterial({
  fragmentShader: frag,
  vertexShader: vert,
  transparent: true,
  uniforms: {
    map: { value: undefined },
    boundingBox: { value: undefined },
  },
});
