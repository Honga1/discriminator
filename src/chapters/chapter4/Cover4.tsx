import { SpringValue, useSpring } from "@react-spring/core";
import { useFrame, useThree } from "@react-three/fiber";
import { Point } from "@vladmandic/face-api/dist/face-api.esm-nobundle.js";
import { Text } from "grommet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ResizeCanvas } from "src/components/ResizeCanvas";
import { useFaceApiPredictions } from "src/hooks/useFaceApiPredictions";
import { useHasFirstFaceApiPrediction } from "src/hooks/useHasFirstFaceApiPrediction";
import { FaceApiPrediction } from "src/store/FaceApiPredictionsStore";
import { store, useStore } from "src/store/store";
import {
  BufferGeometry,
  Mesh,
  ShaderMaterial,
  Vector4,
  VideoTexture,
} from "three";

export default function Cover4() {
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);

  const [state, setState] = useState(0);

  const hasFirstPrediction = useHasFirstFaceApiPrediction();

  useEffect(() => {
    setState(0);

    if (hasFirstPrediction) {
      const timeout1 = setTimeout(() => setState(1), 5000);
      const timeout2 = setTimeout(() => setState(2), 10000);
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
      };
    }
  }, [hasFirstPrediction]);

  const [{ amount }] = useSpring(
    () => ({
      amount: state === 1 || state === 2 ? 1 : 0,
      config: { duration: 5000 },
    }),
    [state]
  );

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <ResizeCanvas
          orthographic
          style={{
            OTransform: "scale(-1, 1)",
            transform: "scale(-1, 1)",
          }}
        >
          <WebcamPlane amount={amount} />
        </ResizeCanvas>
        <div
          style={{
            position: "absolute",
            width: "100%",
            padding: "58px",
            top: 0,
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <Text
            color="yellow"
            size="32px"
            style={{
              textShadow: `0px 4px 4px rgba(0, 0, 0, 0.25)`,
              userSelect: "none",
            }}
          >
            {!hasFirstPrediction ? (
              "Loading Cover..."
            ) : (
              <>
                {state === 0 && `You don't look happy :(`}
                {state === 1 && `Let's see what we can do to fix that.`}
                {state === 2 && `There, much better!`}
              </>
            )}
          </Text>
        </div>
      </div>
    </div>
  );
}

function WebcamPlane({ amount }: { amount: SpringValue<number> }) {
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

  useMouthPosition(predictions, ref);
  useLeftEyePosition(predictions, ref);
  useRightEyePosition(predictions, ref);
  useLeftIrisPosition(predictions, ref);
  useRightIrisPosition(predictions, ref);

  useFrame(() => {
    if (ref.current) {
      ref.current.material.uniforms["amount"]!.value = amount.get();
    }
  });

  return (
    <group scale={[width, height, 1]}>
      <mesh ref={ref}>
        <planeBufferGeometry />
        <primitive
          object={maskMaterial}
          attach="material"
          uniforms-map-value={videoTexture}
          uniforms-mouth-value={new Vector4(0.5, 0.5, 0.5, 0.5)}
          uniforms-leftEye-value={new Vector4(0.5, 0.5, 0.5, 0.5)}
          uniforms-rightEye-value={new Vector4(0.5, 0.5, 0.5, 0.5)}
          uniforms-rightIris-value={new Vector4(0.5, 0.5, 0.5, 0.5)}
          uniforms-leftIris-value={new Vector4(0.5, 0.5, 0.5, 0.5)}
          uniforms-amount-value={0}
        />
      </mesh>
    </group>
  );
}

function useMouthPosition(
  predictions: React.MutableRefObject<FaceApiPrediction | undefined>,
  ref: React.MutableRefObject<Mesh<BufferGeometry, ShaderMaterial> | undefined>
) {
  useFrame(() => {
    const prediction = predictions.current;
    if (!prediction) return;
    const mesh = prediction.landmarks.getMouth();

    const { xMin, yMax, xMax, yMin } = getBoundingBox(mesh, 640, 480);

    if (ref.current?.material !== undefined) {
      ref.current.material.uniforms["mouth"]!.value.x = xMin;
      ref.current.material.uniforms["mouth"]!.value.y = 1 - yMax + 0.06;
      ref.current.material.uniforms["mouth"]!.value.z = xMax;
      ref.current.material.uniforms["mouth"]!.value.w = 1 - yMin + 0.06;
    }
  });
}

function useLeftEyePosition(
  predictions: React.MutableRefObject<FaceApiPrediction | undefined>,
  ref: React.MutableRefObject<Mesh<BufferGeometry, ShaderMaterial> | undefined>
) {
  useFrame(() => {
    const prediction = predictions.current;
    if (!prediction) return;
    const mesh = prediction.landmarks.getLeftEye();

    const { xMin, yMax, xMax, yMin } = getBoundingBox(mesh, 640, 480);

    if (ref.current?.material !== undefined) {
      ref.current.material.uniforms["leftEye"]!.value.x = xMin;
      ref.current.material.uniforms["leftEye"]!.value.y = 1 - yMax;
      ref.current.material.uniforms["leftEye"]!.value.z = xMax;
      ref.current.material.uniforms["leftEye"]!.value.w = 1 - yMin;
    }
  });
}

function useRightEyePosition(
  predictions: React.MutableRefObject<FaceApiPrediction | undefined>,
  ref: React.MutableRefObject<Mesh<BufferGeometry, ShaderMaterial> | undefined>
) {
  useFrame(() => {
    const prediction = predictions.current;
    if (!prediction) return;
    const mesh = prediction.landmarks.getRightEye();

    const { xMin, yMax, xMax, yMin } = getBoundingBox(mesh, 640, 480);

    if (ref.current?.material !== undefined) {
      ref.current.material.uniforms["rightEye"]!.value.x = xMin;
      ref.current.material.uniforms["rightEye"]!.value.y = 1 - yMax;
      ref.current.material.uniforms["rightEye"]!.value.z = xMax;
      ref.current.material.uniforms["rightEye"]!.value.w = 1 - yMin;
    }
  });
}
function useLeftIrisPosition(
  predictions: React.MutableRefObject<FaceApiPrediction | undefined>,
  ref: React.MutableRefObject<Mesh<BufferGeometry, ShaderMaterial> | undefined>
) {
  useFrame(() => {
    const prediction = predictions.current;
    if (!prediction) return;
    const mesh = prediction.landmarks.getLeftEye();

    const { xMin, yMax, xMax, yMin } = getBoundingBox(mesh, 640, 480);

    if (ref.current?.material !== undefined) {
      ref.current.material.uniforms["leftIris"]!.value.x = xMin + 0.008;
      ref.current.material.uniforms["leftIris"]!.value.y = 1 - yMax - 0.003;
      ref.current.material.uniforms["leftIris"]!.value.z = xMax + 0.008;
      ref.current.material.uniforms["leftIris"]!.value.w = 1 - yMin - 0.003;
    }
  });
}

function useRightIrisPosition(
  predictions: React.MutableRefObject<FaceApiPrediction | undefined>,
  ref: React.MutableRefObject<Mesh<BufferGeometry, ShaderMaterial> | undefined>
) {
  useFrame(() => {
    const prediction = predictions.current;
    if (!prediction) return;
    const mesh = prediction.landmarks.getRightEye();

    const { xMin, yMax, xMax, yMin } = getBoundingBox(mesh, 640, 480);

    if (ref.current?.material !== undefined) {
      ref.current.material.uniforms["rightIris"]!.value.x = xMin + 0.008;
      ref.current.material.uniforms["rightIris"]!.value.y = 1 - yMax - 0.003;
      ref.current.material.uniforms["rightIris"]!.value.z = xMax + 0.008;
      ref.current.material.uniforms["rightIris"]!.value.w = 1 - yMin - 0.003;
    }
  });
}

function getBoundingBox(
  mesh: Point[],
  imageWidth: number,
  imageHeight: number
) {
  let xMin = Infinity;
  let xMax = -Infinity;
  let yMax = -Infinity;
  let yMin = Infinity;

  mesh.forEach((point) => {
    const { x, y } = point;
    xMin = Math.min(xMin, x);
    xMax = Math.max(xMax, x);
    yMin = Math.min(yMin, y);
    yMax = Math.max(yMax, y);
  });
  return {
    xMin: xMin / imageWidth - 0.01,
    yMax: yMax / imageHeight + 0.01,
    xMax: xMax / imageWidth + 0.01,
    yMin: yMin / imageHeight - 0.01,
  };
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
uniform vec4 mouth;
uniform vec4 leftEye;
uniform vec4 rightEye;
uniform vec4 leftIris;
uniform vec4 rightIris;
uniform float amount;

vec4 desaturate(vec3 color, float factor)
{
	vec3 lum = vec3(0.299, 0.587, 0.114);
	vec3 gray = vec3(dot(lum, color));
	return vec4(mix(color, gray, factor), 1.0);
}

struct Result {
  vec2 uv;
  float mixDistance;
};

Result getSmile() {
  vec2 topLeft = mouth.xy;
  vec2 bottomRight = mouth.zw;
  vec2 fromTopLeft = vUv - topLeft;
  vec2 distance = bottomRight - topLeft;
  vec2 relativeDistance = fromTopLeft / distance;
  float distanceXFromCenter = abs((relativeDistance.x - 0.5)*2.0);

  float mixDistance = clamp(length((relativeDistance - 0.5)*vec2(1.2, 0.4)), 0.0, 1.0);

  vec2 center = (topLeft + bottomRight) / 2.0;
  vec2 distanceFromCenterLine = (center - vUv)/distance;

  float y = vUv.y - pow(abs(distanceFromCenterLine.x) /3.0, 2.5) * (1.2 - (vUv.y - topLeft.y)/distance.y) * 5.0;
  float x = vUv.x + distanceFromCenterLine.x*distance.x * 0.5;

  Result result;

  result.uv = vec2(x, y);
  result.mixDistance = 1.0 - mixDistance;

  return result;
}

Result getLeftEye() {
  vec2 leftIrisCenter = (leftIris.xy + leftIris.zw)/2.0;
  vec2 topLeft = leftEye.xy;
  vec2 bottomRight = leftEye.zw;
  vec2 fromTopLeft = vUv - topLeft;
  vec2 distance = bottomRight - topLeft;
  vec2 relativeDistance = fromTopLeft / distance;
  float distanceXFromCenter = abs((relativeDistance.x - 0.5)*2.0);

  float mixDistance = clamp(length((relativeDistance - 0.5)*vec2(1.0, 0.7)), 0.0, 1.0);

  vec2 center = leftIrisCenter;
  vec2 distanceFromCenterLine = (center - vUv)/distance;
  float y = vUv.y + distanceFromCenterLine.y*distance.y;
  float x = vUv.x + distanceFromCenterLine.x*distance.x;

  Result result;

  result.uv = vec2(x, y);
  result.mixDistance = 1.0 - mixDistance;

  return result;
}


Result getRightEye() {
  vec2 rightIrisCenter = (rightIris.xy + rightIris.zw)/2.0;

  vec2 topLeft = rightEye.xy;
  vec2 bottomRight = rightEye.zw;
  vec2 fromTopLeft = vUv - topLeft;
  vec2 distance = bottomRight - topLeft;
  vec2 relativeDistance = fromTopLeft / distance;
  float distanceXFromCenter = abs((relativeDistance.x - 0.5)*2.0);

  float mixDistance = clamp(length((relativeDistance - 0.5)*vec2(1.0, 0.7)), 0.0, 1.0);

  vec2 center = rightIrisCenter;
  vec2 distanceFromCenterLine = (center - vUv)/distance;
  float y = vUv.y + distanceFromCenterLine.y*distance.y;
  float x = vUv.x + distanceFromCenterLine.x*distance.x;

  Result result;

  result.uv = vec2(x, y);
  result.mixDistance = 1.0 - mixDistance;

  return result;
}


void main() {
    Result smile = getSmile();
    Result leftEyeKawaii = getLeftEye();
    Result rightEyeKawaii = getRightEye();
    vec2 uv = mix(vUv, smile.uv, smile.mixDistance * amount);
    uv = mix(uv, leftEyeKawaii.uv, leftEyeKawaii.mixDistance * amount);
    uv = mix(uv, rightEyeKawaii.uv, rightEyeKawaii.mixDistance * amount);
    vec4 texelColor = texture2D( map, uv );
    gl_FragColor = desaturate(texelColor.rgb, 1.0 - amount);
}
`;

const maskMaterial = new ShaderMaterial({
  fragmentShader: frag,
  vertexShader: vert,
  transparent: true,
  uniforms: {
    map: { value: undefined },
    mouth: { value: undefined },
    leftEye: { value: undefined },
    rightEye: { value: undefined },
    leftIris: { value: undefined },
    rightIris: { value: undefined },
    amount: { value: undefined },
  },
});
