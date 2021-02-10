import {
  Coord2D,
  Coords3D,
} from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";
import { MutableRefObject, ReactElement, useRef } from "react";
import { Canvas, CanvasContext, useFrame, Viewport } from "react-three-fiber";
import { BufferAttribute, Color, Mesh, Vector3 } from "three";
import { useAnimationFrame } from "../../hooks/useAnimationFrame";
import { PartGroups, PART_GROUPS } from "./part-groups";
import { BoundingBox, IKeyPoints, KeyPoints } from "./VideoDetector";

export const FaceTracker = ({
  keyPoints,
}: {
  keyPoints: { current: IKeyPoints | undefined };
}): ReactElement => {
  const keyPoints2 = useRef<KeyPoints<HTMLVideoElement>>();
  const ref = useRef<CanvasContext>();

  useAnimationFrame(60, () => {
    const maybeContext = ref.current;
    if (!maybeContext) return;
    if (!keyPoints.current) return;
    const result = setNormalizedMesh(keyPoints.current, maybeContext);
    keyPoints2.current = result;
  });

  return (
    <Canvas
      style={{
        width: "100%",
        zIndex: 10,
      }}
      orthographic={true}
      pixelRatio={window.devicePixelRatio}
      webgl1={true}
      camera={{ near: -10000, far: 10000 }}
      noEvents={true}
      onPointerMove={undefined}
      onMouseMove={undefined}
      onCreated={(context) => {
        ref.current = context;
      }}
    >
      {keyPoints2 && (
        <VideoPartRenderer
          keyPoints={keyPoints2}
          parts={["FACE_PLANE", "LEFT_EYE", "RIGHT_EYE", "MOUTH", "NOSE"]}
        ></VideoPartRenderer>
      )}
    </Canvas>
  );
};

function setNormalizedMesh(
  {
    source,
    normalizedMesh,
    aspect: sourceAspect,
    normalizedBoundingBox,
    scaledMesh,
  }: IKeyPoints,
  canvasContext: CanvasContext
) {
  const { viewport } = canvasContext;

  const aspectCorrection = sourceAspect;
  const mesh = getMesh(aspectCorrection, viewport, normalizedMesh);
  const boundingBox = getBoundingBox(
    aspectCorrection,
    viewport,
    normalizedBoundingBox
  );

  const parts = getParts(mesh);
  const facePlane = getFacePlane(mesh);
  const zRotation = getHeadZRotation(mesh);

  const keyPoints: KeyPoints<HTMLVideoElement> = {
    normalizedMesh,
    sourceAspect,
    mesh,
    parts,
    source,
    facePlane: { ...facePlane, zRotation },
    boundingBox,
    scaledMesh,
  };

  return keyPoints;
}

function getBoundingBox(
  aspectCorrection: number,
  viewport: Viewport,
  boundingBox: BoundingBox
): BoundingBox {
  const scalingDimension = Math.min(
    viewport.width,
    viewport.height * aspectCorrection
  );

  return {
    topLeft: [
      boundingBox.topLeft[0] * scalingDimension - scalingDimension / 2,
      -(boundingBox.topLeft[1] * scalingDimension - scalingDimension / 2) /
        aspectCorrection,
    ],
    bottomRight: [
      boundingBox.bottomRight[0] * scalingDimension - scalingDimension / 2,
      -(boundingBox.bottomRight[1] * scalingDimension - scalingDimension / 2) /
        aspectCorrection,
    ],
  };
}

function getParts(mesh: Coords3D) {
  const entries = Object.entries(PART_GROUPS).map(([part, indices]) => [
    part,
    mesh.filter((_, index) => indices.includes(index)),
  ]);

  const parts = Object.fromEntries(entries) as {
    [key in PartGroups]: Coords3D;
  };
  return parts;
}

function getFacePlane(mesh: Coords3D) {
  const facePlanePoints: Coords3D = PART_GROUPS.FACE_PLANE.map(
    (index) => mesh[index]!
  );

  if (facePlanePoints.length !== 3) {
    throw new Error("facePlanePoints should only contain three points");
  }

  const facePlane = getPlaneFromPoints(
    ...(facePlanePoints as [Coord3D, Coord3D, Coord3D])
  );
  return facePlane;
}
type Coord3D = [number, number, number];

function getMesh(
  aspectCorrection: number,
  viewport: Viewport,
  normalizedMesh: Coords3D
) {
  const scalingDimension = Math.min(
    viewport.width,
    viewport.height * aspectCorrection
  );

  const mesh: Coords3D = normalizedMesh.map(([x, y, z]) => [
    x * scalingDimension - scalingDimension / 2,
    (y * scalingDimension + scalingDimension / 2) / aspectCorrection,
    z * scalingDimension + scalingDimension / 2,
  ]);
  return mesh;
}

const getPlaneFromPoints = (
  pointA: Coord3D,
  pointB: Coord3D,
  pointC: Coord3D
): { normal: Coord3D; offset: number } => {
  const A = new Vector3().fromArray(pointA);
  const B = new Vector3().fromArray(pointB);
  const C = new Vector3().fromArray(pointC);
  const AB = B.clone().sub(A);
  const AC = C.clone().sub(A);

  const normal = AB.clone().cross(AC);
  const offset = (normal.x * A.x, normal.y * A.y, normal.z * A.z);

  return { normal: normal.toArray() as Coord3D, offset };
};

function getHeadZRotation(mesh: Coords3D) {
  const facePlanePoints: Coords3D = PART_GROUPS.FACE_PLANE.map(
    (index) => mesh[index]!
  );

  if (facePlanePoints.length !== 3) {
    throw new Error("facePlanePoints should only contain three points");
  }

  const [, leftCheek, rightCheeck] = facePlanePoints as [
    Coord3D,
    Coord3D,
    Coord3D
  ];

  const distance = [
    rightCheeck[0] - leftCheek[0],
    rightCheeck[1] - leftCheek[1],
  ] as Coord2D;
  const angle = -Math.atan2(distance[1], distance[0]);
  return angle;
}

const VideoPartRenderer = ({
  parts,
  color = "magenta",
  keyPoints,
}: {
  parts: PartGroups[];
  color?: string | number | Color | undefined;
  keyPoints: MutableRefObject<KeyPoints<HTMLVideoElement> | undefined>;
}): React.ReactElement => {
  const ref = useRef<Mesh>();
  const maxPoints = parts.map((part) => PART_GROUPS[part]).flat().length;

  useFrame(() => {
    const geometry = ref.current?.geometry;
    const partsInStore = keyPoints.current?.parts;
    if (partsInStore === undefined) return;
    const mesh = parts.map((part) => partsInStore[part]).flat(2);
    if (geometry === undefined) return;

    const attribute = geometry.getAttribute("position") as BufferAttribute;
    attribute.set(mesh, 0);
    geometry.setDrawRange(0, maxPoints);
    attribute.needsUpdate = true;
  });

  return (
    <points ref={ref} key={parts.toString()}>
      <bufferGeometry drawRange={{ start: 0, count: 0 }}>
        <bufferAttribute
          attachObject={["attributes", "position"]}
          itemSize={3}
          array={new Float32Array(maxPoints * 3)}
          count={maxPoints}
        />
      </bufferGeometry>
      <pointsMaterial color={color} size={10} />
    </points>
  );
};
