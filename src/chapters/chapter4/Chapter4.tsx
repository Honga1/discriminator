import { Html, useContextBridge } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Box, ResponsiveContext, Text, ThemeContext } from "grommet";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ResizeCanvas } from "src/components/ResizeCanvas";
import { VideoPlayer } from "src/components/VideoPlayer";
import { WorldOffset } from "src/components/WorldOffset";
import { useChapter } from "src/hooks/useChapter";
import { useFaceApiPredictions } from "src/hooks/useFaceApiPredictions";
import { useStore } from "src/store/store";
import { colorTheme } from "src/theme";
import styled from "styled-components";
import {
  BufferGeometry,
  Mesh,
  ShaderMaterial,
  Vector3,
  VideoTexture,
} from "three";

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

  return (
    <Box
      style={{ position: "relative", width: "100%", height: "100%" }}
      align="center"
      overflow="hidden"
    >
      {part !== "VIDEO" && (
        <ResizeCanvas
          linear
          orthographic
          style={{ position: "absolute", width: "100%", height: "100%" }}
        >
          <ContextBridge>
            <WebcamPlane />
          </ContextBridge>
        </ResizeCanvas>
      )}

      <VideoPlayer
        ref={ref}
        style={{
          boxSizing: "border-box",
          outline: "none",
          width: "100%",
          height: "100%",
          opacity: part === "INTERACTIVE" ? "0" : "1",
        }}
        width="100%"
        height="100%"
        srcDash={`https://discriminator-media-server.jaeperris.com/part4/stream.mpd`}
        srcHls={`https://discriminator-media-server.jaeperris.com/part4/master.m3u8`}
      ></VideoPlayer>
    </Box>
  );
}

function WebcamPlane() {
  const webcam = useStore((state) => state.webcamHTMLElement);
  const aspect = useStore((state) => state.webcamAspect);
  const viewport = useThree((state) => state.viewport);

  const ref = useRef<Mesh<BufferGeometry, ShaderMaterial>>();
  const width = Math.min(viewport.width, viewport.height * aspect);
  const height = Math.min(viewport.width / aspect, viewport.height);

  const videoTexture = useMemo(() => {
    return new VideoTexture(webcam);
  }, [webcam]);

  const predictions = useFaceApiPredictions();

  const isSmall = useContext(ResponsiveContext) === "small";

  useFrame(() => {
    if (topLeft.current && predictions.current !== undefined) {
      const { width, height, x, y } = predictions.current.detection.relativeBox;

      topLeft.current.position.lerp(
        new Vector3(x + width / 2, -y - height / 2, 0.0),
        0.1
      );
      topLeft.current.scale.lerp(new Vector3(width, height, 1.0), 0.1);
    }

    if (html.current && predictions.current !== undefined) {
      ReactDOM.render(
        <React.StrictMode>
          <table>
            <StyledTBody>
              <tr>
                <td>
                  <Text color={colorTheme.yellow}>confidence</Text>
                </td>
                <td>
                  <Text color={colorTheme.offWhite}>
                    {predictions.current.detection.score.toFixed(2)}
                  </Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text color={colorTheme.yellow}>age</Text>
                </td>
                <td>
                  <Text color={colorTheme.offWhite}>
                    {predictions.current.age.toFixed(2)}
                  </Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text color={colorTheme.yellow}>gender</Text>
                </td>
                <td>
                  <Text
                    color={colorTheme.offWhite}
                  >{`${predictions.current.genderProbability.toFixed(2)} ${
                    predictions.current.gender
                  }`}</Text>
                </td>
              </tr>
              <tr>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td>
                  <Text color={colorTheme.redLight}>angry</Text>
                </td>
                <td>
                  <Text color={colorTheme.offWhite}>
                    {predictions.current.expressions.angry.toFixed(2)}
                  </Text>
                </td>
              </tr>
              {!isSmall && (
                <>
                  <tr>
                    <td>
                      <Text color={colorTheme.redLight}>disgusted</Text>
                    </td>
                    <td>
                      <Text color={colorTheme.offWhite}>
                        {predictions.current.expressions.disgusted.toFixed(2)}
                      </Text>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <Text color={colorTheme.redLight}>fearful</Text>
                    </td>
                    <td>
                      <Text color={colorTheme.offWhite}>
                        {predictions.current.expressions.fearful.toFixed(2)}
                      </Text>
                    </td>
                  </tr>
                </>
              )}
              <tr>
                <td>
                  <Text color={colorTheme.greenLight}>happy</Text>
                </td>
                <td>
                  <Text color={colorTheme.offWhite}>
                    {predictions.current.expressions.happy.toFixed(2)}
                  </Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text color={colorTheme.greenLight}>neutral</Text>
                </td>
                <td>
                  <Text color={colorTheme.offWhite}>
                    {predictions.current.expressions.neutral.toFixed(2)}
                  </Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text color={colorTheme.blueLight}>sad</Text>
                </td>
                <td>
                  <Text color={colorTheme.offWhite}>
                    {predictions.current.expressions.sad.toFixed(2)}
                  </Text>
                </td>
              </tr>
              {!isSmall && (
                <tr>
                  <td>
                    <Text color={colorTheme.blueLight}>surprised</Text>
                  </td>
                  <td>
                    <Text color={colorTheme.offWhite}>
                      {predictions.current.expressions.surprised.toFixed(2)}
                    </Text>
                  </td>
                </tr>
              )}
            </StyledTBody>
          </table>
        </React.StrictMode>,
        html.current
      );
    }
  });

  const topLeft = useRef<Mesh>();
  const html = useRef<HTMLDivElement>(null);
  return (
    <>
      <WorldOffset targetAspect={aspect}>
        <mesh ref={topLeft}>
          <planeBufferGeometry />
          <meshBasicMaterial wireframe />
          <Html ref={html} position={[0.5, 0.5, 0]}></Html>
        </mesh>
      </WorldOffset>
      <group scale={[width, height, 1]} position={[0, 0, -1]}>
        <mesh ref={ref}>
          <planeBufferGeometry />
          <meshBasicMaterial map={videoTexture} toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}

const StyledTBody = styled.tbody`
  tr {
    vertical-align: top;
  }

  td {
    padding: 0 15px;
  }

  span {
    line-height: 30px;
    font-size: 20px;
    white-space: nowrap;
    user-select: none;
  }
`;
