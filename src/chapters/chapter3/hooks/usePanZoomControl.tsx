import React, { useCallback, useState } from "react";
import { SpringConfig, to, useSpring } from "react-spring";
import { useGesture } from "react-use-gesture";
import { clamp } from "src/libs/math";

export function usePanZoomControl(isEnabled: boolean) {
  const [{ x, y, scale }, api] = useSpring(
    () => ({
      x: 0,
      y: 0,
      scale: 1,
      drag: false,
    }),
    []
  );

  const start = useCallback(
    (value: {
      x?: number;
      y?: number;
      scale?: number;
      drag?: boolean;
      config?: SpringConfig;
    }) => {
      api.start({
        ...value,
        onStart: () => setIsAnimating(true),
        onRest: () => setIsAnimating(false),
      });
    },
    [api]
  );

  const bind = useGesture(
    {
      onDrag: ({ delta: [deltaX, deltaY], event, pinching }) => {
        event.preventDefault();

        !pinching &&
          start({
            x: x.goal + deltaX / scale.goal,
            y: y.goal + deltaY / scale.goal,
          });
      },

      onWheel: ({
        delta: [, distance],
        event: { clientX, clientY, target },
      }) => {
        const nextScale = clamp(
          (scale?.goal ?? 1) * 1.1 ** (-distance / 52),
          1,
          4
        );

        // Offset from 0,0 being the center
        const { resultX, resultY } = getZoomPosition(
          x.goal,
          y.goal,
          target,
          clientX,
          clientY,
          scale.goal,
          nextScale
        );
        start({
          scale: nextScale,
          x: resultX,
          y: resultY,
        });
      },

      onPinch: ({ vdva: [distance, a], event, _pointerIds }) => {
        const nextScale = clamp((scale?.goal ?? 1) * 1.1 ** distance, 1, 4);
        if (event.type.includes("touch")) {
          const castEvent = event as React.TouchEvent<HTMLElement>;
          const { touches, target } = castEvent;

          const maybeTouch1 = touches[_pointerIds[0]];
          const maybeTouch2 = touches[_pointerIds[1]];

          let clientX;
          let clientY;
          if (maybeTouch1 && maybeTouch2) {
            clientX = (maybeTouch1.clientX + maybeTouch2.clientX) / 2;
            clientY = (maybeTouch1.clientY + maybeTouch2.clientY) / 2;
          } else if (maybeTouch1) {
            clientX = maybeTouch1.clientX;
            clientY = maybeTouch1.clientY;
          } else if (maybeTouch2) {
            clientX = maybeTouch2.clientX;
            clientY = maybeTouch2.clientY;
          } else {
            clientX = window.innerWidth / 2;
            clientY = window.innerHeight / 2;
          }

          const { resultX, resultY } = getZoomPosition(
            x.goal,
            y.goal,
            target,
            clientX,
            clientY,
            scale.goal,
            nextScale
          );

          start({
            scale: nextScale,
            x: resultX,
            y: resultY,
          });
        } else {
          start({
            scale: nextScale,
          });
        }
      },
    },
    { enabled: isEnabled }
  );

  const transform = to(
    [x, y, scale],
    (x, y, scale) => `scale(${scale}) translate(${x}px, ${y}px)`
  );

  const [isAnimating, setIsAnimating] = useState(false);

  return { bind, transform, start, scale, x, y, isAnimating };
}

function getZoomPosition(
  xGoal: number,
  yGoal: number,
  target: EventTarget | null,
  clientX: number,
  clientY: number,
  scaleGoal: number,
  nextScale: number
) {
  const containerBB = (target as HTMLElement | null)?.getBoundingClientRect();

  const relativeMouseX = clientX - containerBB!.left - containerBB!.width / 2;
  const relativeMouseY = clientY - containerBB!.top - containerBB!.height / 2;

  const worldMouseX = relativeMouseX / scaleGoal;
  const worldMouseY = relativeMouseY / scaleGoal;

  const offsetFromCameraX = xGoal - worldMouseX;
  const offsetFromCameraY = yGoal - worldMouseY;

  const nextMouseOffsetX = xGoal - relativeMouseX / nextScale;
  const nextMouseOffsetY = yGoal - relativeMouseY / nextScale;

  const deltaMovementX = offsetFromCameraX - nextMouseOffsetX;
  const deltaMovementY = offsetFromCameraY - nextMouseOffsetY;

  const resultX = xGoal + deltaMovementX;
  const resultY = yGoal + deltaMovementY;
  return { resultX, resultY };
}
