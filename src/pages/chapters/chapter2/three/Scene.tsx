import { useFrame, useThree } from "@react-three/fiber";
import { memo, Suspense, useMemo, useRef } from "react";
import { BufferGeometry, Mesh, RawShaderMaterial } from "three";
import { Predictions } from "../usePredictions";
import { Mask } from "./Mask";
import { RainbowVomit } from "./RainbowVomit";
import { SceneContext } from "./SceneContext";
import { WorldOffset } from "./WorldOffset";

(function () {
  var script = document.createElement("script");
  script.onload = function () {
    // @ts-ignore
    var stats = new Stats();
    document.body.appendChild(stats.dom);
    requestAnimationFrame(function loop() {
      stats.update();
      requestAnimationFrame(loop);
    });
  };
  script.src = "//cdn.jsdelivr.net/gh/Kevnz/stats.js/build/stats.min.js";
  document.head.appendChild(script);
})();

export const Scene = ({
  predictions,
}: {
  predictions: { current: Predictions[] };
}) => {
  return (
    <SceneContext.Provider value={{ facemesh: predictions }}>
      <Background></Background>
      <WorldOffset>
        {/* <Gizmo  gizmoHome={4} /> */}
        {/* <Dots /> */}
        {/* <BoundingRectangle /> */}
        <Mask></Mask>
        {/* <ARObject  /> */}

        <Suspense fallback={null}>
          <RainbowVomit />
        </Suspense>
      </WorldOffset>
    </SceneContext.Provider>
  );
};

const Background = memo(() => {
  const ref = useRef<Mesh<BufferGeometry, RawShaderMaterial>>(null);
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.4 },
    }),
    []
  );

  const { viewport } = useThree();

  useFrame((context) => {
    if (!ref.current) return;
    ref.current.material.uniforms.u_time!.value =
      context.clock.getElapsedTime() * 0.2;
  });
  return (
    <mesh
      ref={ref}
      position={[0.0, -0.0, 0.0]}
      scale={[viewport.width, viewport.height, 1.0]}
    >
      <planeBufferGeometry />
      <shaderMaterial
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </mesh>
  );
});

const fragmentShader = `
varying vec2 vUv;
uniform float u_time;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123 + u_time);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);
    u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {

    vec2 pos = vec2(vUv*100.0);

    float n = noise(pos);

    gl_FragColor = vec4(vec3(n), 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;

void main() {

	#include <uv_vertex>

	vec3 transformed = vec3( position );
  vUv = uv.xy;
  vec4 mvPosition = vec4( transformed, 1.0 );
  mvPosition = modelViewMatrix * mvPosition;
  mvPosition = projectionMatrix * mvPosition;
  gl_Position = vec4(mvPosition.x * 2.0, mvPosition.y * 2.0, 10.0, 10.0);
}`;
