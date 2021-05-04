import React from "react";
import { SpringValue } from "react-spring";
import { useAnimationFrame } from "../../../hooks/useAnimationFrame";

export function useAutoRevealElements(
  ref: React.RefObject<HTMLDivElement>,
  stage: string | number,
  scale: SpringValue<number>,
  setShouldShowElements: React.Dispatch<React.SetStateAction<Set<HTMLElement>>>
) {
  useAnimationFrame(1, () => {
    if (!ref.current) return;
    if (stage !== "USER_CONTROL") return;
    const container = ref.current;
    const elements = container.getElementsByClassName("image-card");

    const containerBb = container.getBoundingClientRect();
    const nextShownElements = new Set<HTMLElement>();

    for (const key in elements) {
      if (Object.prototype.hasOwnProperty.call(elements, key)) {
        const element = elements[key]! as HTMLElement;

        const bb = element.getBoundingClientRect();

        const distanceFromCenterX =
          ((bb.left + bb.right) / 2 - containerBb.width / 2) /
          containerBb.width;
        const distanceFromCenterY =
          ((bb.top + bb.bottom) / 2 - containerBb.height / 2) /
          containerBb.height;

        const distance =
          Math.hypot(distanceFromCenterX, distanceFromCenterY) <
          0.1 * scale.get();
        if (distance) {
          nextShownElements.add(element);
        }
      }
    }

    if (nextShownElements.size !== 0) {
      setShouldShowElements(nextShownElements);
    }
  });
}
