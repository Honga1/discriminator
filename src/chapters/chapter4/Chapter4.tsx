import { Line, useContextBridge } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Box, Grid, ResponsiveContext, Text, ThemeContext } from "grommet";
import { memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ResizeCanvas } from "src/components/ResizeCanvas";
import { VideoPlayer } from "src/components/VideoPlayer";
import { useChapter } from "src/hooks/useChapter";
import {
  useFaceApiPredictions,
  useStatefulApiPredictions,
} from "src/hooks/useFaceApiPredictions";
import { FaceApiPrediction } from "src/store/FaceApiPredictionsStore";
import { useStore } from "src/store/store";
import { colorTheme } from "src/theme";
import styled from "styled-components";
import {
  Mesh,
  PlaneBufferGeometry,
  ShaderMaterial,
  Vector4,
  VideoTexture,
} from "three";
import { Line2 } from "three-stdlib";
import createHook from "zustand";
import create from "zustand/vanilla";
import { SquareDiv } from "../chapter3/components/SquareDiv";

type Stages =
  | "VIDEO"
  | "DRAW_WIREFRAME"
  | "SHOW_IMAGE"
  | "SHOW_AGE"
  | "BLINK_GENDER"
  | "SHOW_GENDER"
  | "SHOW_EXPRESSION_HEADER"
  | "TYPE_EXPRESSION";

const chapter4Store = create<{
  stage: Stages;
  wireframePieces: number;
}>((get, set) => ({
  stage: "VIDEO",
  wireframePieces: 0,
}));

const useChapter4Store = createHook(chapter4Store);

export default function Chapter4() {
  const ref = useRef<HTMLVideoElement>(null);
  useChapter(ref, true);

  const stage = useChapter4Store((state) => state.stage);
  const setStage = (stage: Stages) => chapter4Store.setState({ stage });

  const [preloadCanvas, setPreloadCanvas] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const video = ref.current;
    const onTimeUpdate = ({ nativeEvent: event }: { nativeEvent: Event }) => {
      const video = event.target as HTMLVideoElement;
      const seconds = Math.round(video.currentTime);

      console.log(seconds);

      if (seconds > 62 && seconds < 119) {
        setPreloadCanvas(true);
      } else {
        setPreloadCanvas(false);
      }
      if (seconds < 64) {
        chapter4Store.setState({ stage: "VIDEO", wireframePieces: 0 });
      } else if (seconds < 70) {
        setStage("DRAW_WIREFRAME");
      } else if (seconds < 80) {
        setStage("SHOW_IMAGE");
      } else if (seconds < 85) {
        setStage("SHOW_AGE");
        chapter4Store.setState({ wireframePieces: 0 });
      } else if (seconds < 88) {
        chapter4Store.setState({ wireframePieces: 0 });
        setStage("BLINK_GENDER");
      } else if (seconds < 94) {
        chapter4Store.setState({ wireframePieces: 0 });
        setStage("SHOW_GENDER");
      } else if (seconds < 98) {
        chapter4Store.setState({ wireframePieces: 0 });
        setStage("SHOW_EXPRESSION_HEADER");
      } else if (seconds < 119) {
        chapter4Store.setState({ wireframePieces: 0 });
        setStage("TYPE_EXPRESSION");
      } else {
        chapter4Store.setState({ stage: "VIDEO", wireframePieces: 0 });
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
      {preloadCanvas && (
        <Box
          flex={false}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: stage === "VIDEO" ? 0 : 1,
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
                    style={{
                      width: "100%",
                      height: "100%",
                      OTransform: "scale(-1, 1)",
                      transform: "scale(-1, 1)",
                    }}
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
              style={{ width: "100%", maxWidth: "800px", height: "100%" }}
              rows={["auto"]}
              columns={["auto", "min-content"]}
              gap="59px"
            >
              <Box
                style={{ position: "relative", height: "100%" }}
                flex={false}
              >
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
                      style={{
                        width: "100%",
                        height: "100%",
                        OTransform: "scale(-1, 1)",
                        transform: "scale(-1, 1)",
                      }}
                    >
                      <ContextBridge>
                        <WebcamPlane />
                      </ContextBridge>
                    </ResizeCanvas>
                  </SquareDiv>
                </Box>
              </Box>
              <Box justify="center">
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
          opacity: stage !== "VIDEO" ? "0" : "1",
          userSelect: "none",
        }}
        width="100%"
        height="100%"
        srcDash={`https://discriminator-media-server.jaeperris.com/part4/stream.mpd`}
        srcHls={`https://discriminator-media-server.jaeperris.com/part4/master.m3u8`}
      ></VideoPlayer>
    </Box>
  );
}

const WebcamPlane = memo(() => {
  const webcam = useStore((state) => state.webcamHTMLElement);
  const viewport = useThree((state) => state.viewport);

  const showWebcamFeed = useChapter4Store(
    (state) => state.stage !== "VIDEO" && state.stage !== "DRAW_WIREFRAME"
  );

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
    <group scale={[viewport.width, viewport.height, 1]}>
      {showWebcamFeed && (
        <mesh ref={topLeft}>
          <planeBufferGeometry />
          <primitive
            object={facePlaneMaterial}
            attach="material"
            uniforms-map-value={videoTexture}
            uniforms-boundingBox-value={new Vector4(0.2, 0.8, 0.8, 0.2)}
          />
        </mesh>
      )}
      <LineFace />
    </group>
  );
});

WebcamPlane.displayName = "WebcamPlane";

const LineFace = memo(() => {
  const predictions = useFaceApiPredictions();
  const ref = useRef<Line2>(null);
  const stage = useChapter4Store((state) => state.stage);
  const wireframePieces = useChapter4Store((state) => state.wireframePieces);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stage === "DRAW_WIREFRAME" || wireframePieces !== 0) {
        chapter4Store.setState({
          wireframePieces: Math.min(
            chapter4Store.getState().wireframePieces + 1,
            68
          ),
        });
      }
    }, 80);

    return () => clearInterval(interval);
  }, [stage, wireframePieces]);

  useFrame(() => {
    if (!ref.current) return;
    if (!predictions.current) return;

    (window as any).data =
      ref.current.geometry.getAttribute("position").array.length;

    ref.current.geometry.setPositions([0, 0, 0, 1, 1, 1]);

    const wireframePieces = chapter4Store.getState().wireframePieces;

    ref.current.geometry.setPositions(
      predictions.current.landmarks.relativePositions.flatMap(({ x, y }) => [
        (x - 0.5) / 1.5,
        (-y + 0.5 - 0.3 * 0.5) / 1.5,
        1,
      ])
    );
    ref.current.geometry.instanceCount = wireframePieces;
  });

  const line = useMemo(
    () => (
      <Line
        skinning
        ref={ref}
        points={Array.from({ length: 68 }).map(() => [0, 0, 0])}
        color={colorTheme.greenLight}
      />
    ),
    []
  );
  return line;
});

LineFace.displayName = "LineFace";

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
  vec2 invertedUv = vec2(uv.x, 1.0 - uv.y);
  
	vec4 texelColor = texture2D( map, invertedUv );
  gl_FragColor = vec4(texelColor.rgb,1.0);

  if(invertedUv.x < 0.0) {
    float distance = abs(invertedUv.x / 0.1);
    gl_FragColor = mix(gl_FragColor, vec4(0.0,0.0,0.0,1.0), distance);
  } else if(invertedUv.x > 1.0) {
    float distance = abs((invertedUv.x - 1.0) / 0.1);
    gl_FragColor = mix(gl_FragColor, vec4(0.0,0.0,0.0,1.0), distance);
  } 
  
  if(invertedUv.y < 0.0) {
    float distance = abs(invertedUv.y / 0.1);
    gl_FragColor = mix(gl_FragColor, vec4(0.0,0.0,0.0,1.0), distance);
  } else if(invertedUv.y > 1.0) {
    float distance = abs((invertedUv.y - 1.0) / 0.1);
    gl_FragColor = mix(gl_FragColor, vec4(0.0,0.0,0.0,1.0), distance);
  }
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

const AIInfo = () => {
  const predictions =
    useStatefulApiPredictions() ??
    ({
      age: 0,
      detection: { score: 0 },
      gender: "unknown",
      confidence: 0,
      expressions: {
        angry: 0,
        disgusted: 0,
        fearful: 0,
        happy: 0,
        neutral: 0,
        sad: 0,
        surprised: 0,
      },
    } as unknown as FaceApiPrediction);
  const isSmall = useContext(ResponsiveContext) === "small";

  const stage = useChapter4Store((state) => state.stage);

  const emotionOpacity =
    stage !== "VIDEO" &&
    stage !== "DRAW_WIREFRAME" &&
    stage !== "SHOW_IMAGE" &&
    stage !== "SHOW_AGE" &&
    stage !== "BLINK_GENDER" &&
    stage !== "SHOW_GENDER" &&
    stage !== "SHOW_EXPRESSION_HEADER"
      ? 1
      : 0;
  const emotionHeaderOpacity =
    stage !== "VIDEO" &&
    stage !== "DRAW_WIREFRAME" &&
    stage !== "SHOW_IMAGE" &&
    stage !== "SHOW_AGE" &&
    stage !== "BLINK_GENDER" &&
    stage !== "SHOW_GENDER"
      ? 1
      : 0;
  const genderOpacity =
    stage !== "VIDEO" &&
    stage !== "DRAW_WIREFRAME" &&
    stage !== "SHOW_IMAGE" &&
    stage !== "SHOW_AGE"
      ? 1
      : 0;
  const ageOpacity =
    stage !== "VIDEO" && stage !== "DRAW_WIREFRAME" && stage !== "SHOW_IMAGE"
      ? 1
      : 0;
  return (
    <table>
      <StyledTBody isSmall={isSmall}>
        <tr>
          <td>
            <Text color={colorTheme.yellow}>confidence</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>
              {predictions.detection.score.toFixed(2)}
            </Text>
          </td>
        </tr>
        <tr
          style={{
            opacity: ageOpacity,
          }}
        >
          <td>
            <Text color={colorTheme.yellow}>age</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>
              {predictions.age.toFixed(2)}
            </Text>
          </td>
        </tr>

        <tr
          style={{
            opacity: genderOpacity,
          }}
        >
          <td>
            <Text color={colorTheme.yellow}>gender</Text>
          </td>
          <td>
            <Text
              color={colorTheme.offWhite}
              className={stage === "BLINK_GENDER" ? "blinking-cursor" : ""}
            >
              {stage === "BLINK_GENDER" ? "_" : predictions.gender}
            </Text>
          </td>
        </tr>

        <tr>
          <td></td>
          <td>
            {/* Reserves horizontal space for gender changing between male -> female -> unknown */}
            <Text style={{ opacity: 0 }}>unknown</Text>
          </td>
        </tr>

        {!isSmall && (
          <tr
            style={{
              opacity: emotionHeaderOpacity,
            }}
          >
            <td>
              <br />
              <Text color={colorTheme.offWhite}>emotion</Text>
            </td>
            <td></td>
          </tr>
        )}

        <tr
          style={{
            opacity: emotionOpacity,
          }}
        >
          <td>
            <Text color={colorTheme.redLight}>angry</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>
              <BarChart amount={predictions.expressions.angry} />
            </Text>
          </td>
        </tr>
        {!isSmall && (
          <>
            <tr
              style={{
                opacity: emotionOpacity,
              }}
            >
              <td>
                <Text color={colorTheme.redLight}>disgusted</Text>
              </td>
              <td>
                <Text color={colorTheme.offWhite}>
                  <BarChart amount={predictions.expressions.disgusted} />
                </Text>
              </td>
            </tr>

            <tr
              style={{
                opacity: emotionOpacity,
              }}
            >
              <td>
                <Text color={colorTheme.redLight}>fearful</Text>
              </td>
              <td>
                <Text color={colorTheme.offWhite}>
                  <BarChart amount={predictions.expressions.fearful} />
                </Text>
              </td>
            </tr>
          </>
        )}
        <tr
          style={{
            opacity: emotionOpacity,
          }}
        >
          <td>
            <Text color={colorTheme.greenLight}>happy</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>
              <BarChart amount={predictions.expressions.happy} />
            </Text>
          </td>
        </tr>
        <tr
          style={{
            opacity: emotionOpacity,
          }}
        >
          <td>
            <Text color={colorTheme.greenLight}>neutral</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>
              <BarChart amount={predictions.expressions.neutral} />
            </Text>
          </td>
        </tr>
        <tr
          style={{
            opacity: emotionOpacity,
          }}
        >
          <td>
            <Text color={colorTheme.blueLight}>sad</Text>
          </td>
          <td>
            <Text color={colorTheme.offWhite}>
              <BarChart amount={predictions.expressions.sad} />
            </Text>
          </td>
        </tr>
        {!isSmall && (
          <tr
            style={{
              opacity: emotionOpacity,
            }}
          >
            <td>
              <Text color={colorTheme.blueLight}>surprised</Text>
            </td>
            <td>
              <Text color={colorTheme.offWhite}>
                <BarChart amount={predictions.expressions.surprised} />
              </Text>
            </td>
          </tr>
        )}
      </StyledTBody>
    </table>
  );
};

const BarChart = ({ amount }: { amount: number }) => {
  return (
    <>
      {Array.from({ length: Math.floor(amount * 10) })
        .map(() => "|")
        .join("")}
    </>
  );
};

const StyledTBody = styled.tbody<{ isSmall: boolean }>`
  tr {
    vertical-align: top;
  }

  * {
    transition: opacity 2s linear;
  }

  td:last-child {
    text-align: right;
  }

  td {
    padding: 5px 15px;
  }

  span {
    line-height: 30px;
    font-size: 20px;
    white-space: nowrap;
    user-select: none;
  }

  .blinking-cursor {
    animation: 1s blink step-end infinite;
  }

  @keyframes blink {
    from,
    to {
      color: transparent;
    }
    50% {
      color: ${colorTheme.offWhite};
    }
  }
`;
