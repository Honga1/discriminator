import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import { usePredictions } from "src/hooks/usePredictions";
import { V3 } from "src/libs/v3";
import {
  BufferGeometry,
  Mesh,
  ShaderMaterial,
  Vector2,
  VideoTexture,
} from "three";
import { useStore } from "../../store/store";
import { TRIANGULATION, UV_COORDS } from "../chapter2/part1/mask";
import { WorldOffset } from "../chapter2/part1/WorldOffset";

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

  const predictions = usePredictions();

  useFrame(() => {
    const prediction = predictions.current[0];
    if (!prediction) return;

    const mesh = prediction.scaledMesh as V3[];

    const xLeft = Math.min(mesh[207]![0], mesh[210]![0]);
    const yTop = Math.max(mesh[207]![1], mesh[427]![1]);
    const yBottom = Math.min(mesh[430]![1], mesh[210]![1]);
    const xRight = Math.max(mesh[430]![0], mesh[427]![0]);

    if (ref.current?.material !== undefined) {
      ref.current.material.uniforms["topLeft"]!.value.x = xLeft;
      ref.current.material.uniforms["topLeft"]!.value.y = yTop + 1;
      ref.current.material.uniforms["bottomRight"]!.value.x = xRight;
      ref.current.material.uniforms["bottomRight"]!.value.y = yBottom + 1;

      // console.log(ref.current.material.uniforms);
    }

    TRIANGULATION.forEach((vertexIndex, index) => {
      const vertex = mesh[vertexIndex];
      const uv = UV_COORDS[vertexIndex];
      if (!vertex) return;
      if (!uv) return;
      const [x, y, z] = vertex;
      // positions.setXYZ(index, x, y, z);
    });
  });

  return (
    <group scale={[width, height, 1]}>
      <mesh ref={ref}>
        <planeBufferGeometry />
        <primitive
          object={maskMaterial}
          attach="material"
          uniforms-map-value={videoTexture}
          uniforms-topLeft-value={new Vector2(0.5, 0.5)}
          uniforms-bottomRight-value={new Vector2(0.6, 0.6)}
        />
      </mesh>
    </group>
  );
}

export default function Cover3() {
  const aspect = useStore((state) => state.webcamAspect);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas orthographic>
        <WebcamPlane />
        <WorldOffset targetAspect={aspect}>
          {/* <WireframeMask track="webcam" /> */}
        </WorldOffset>
      </Canvas>
    </div>
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
uniform vec2 topLeft;
uniform vec2 bottomRight;

void main() {

    vec2 fromTopLeft = vUv - topLeft;
    vec2 distance = bottomRight - topLeft;
    vec2 relativeDistance = fromTopLeft / distance;
    float distanceXFromCenter = abs((relativeDistance.x - 0.5)*2.0);

    // Smile
    float mixDistance = clamp(length((relativeDistance - 0.5)*vec2(1.5, 1.4)), 0.0, 1.0);
    float y = vUv.y - distance.y /1.5 - sin(distanceXFromCenter/8.0);
    float x = vUv.x  - (relativeDistance.x - 0.5)/4.0;
    vec2 uv = mix(vUv, vec2(vUv.x, y), 1.0 - mixDistance);
    vec4 texelColor = texture2D( map, uv );
    gl_FragColor = vec4(texelColor.rgb, 1.0);
}
`;

const maskMaterial = new ShaderMaterial({
  fragmentShader: frag,
  vertexShader: vert,
  transparent: true,
  uniforms: {
    map: { value: undefined },
    topLeft: { value: undefined },
    bottomRight: { value: undefined },
  },
});
