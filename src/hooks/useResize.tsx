import React, { useLayoutEffect, useState } from "react";

export function useResize(element: React.RefObject<HTMLElement>) {
  let [{ screenWidth, screenHeight, aspect, rect }, setState] = useState<{
    screenWidth: number;
    screenHeight: number;
    aspect: number;
    rect: Rect | undefined;
  }>({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    aspect: window.innerWidth / window.innerHeight,
    rect:
      element?.current !== null
        ? copyRect(element.current.getBoundingClientRect())
        : undefined,
  });

  const onResize = () => {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    aspect = screenWidth / screenHeight;

    if (element && element.current) {
      const clientRect = element.current.getBoundingClientRect();
      rect = copyRect(clientRect);
    }

    setState({
      screenWidth,
      screenHeight,
      aspect,
      rect,
    });
  };

  useLayoutEffect(() => {
    window.addEventListener("resize", onResize, false);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { screenWidth, screenHeight, aspect, rect };
}
type Rect = {
  width: number;
  height: number;
  top: number;
  bottom: number;
  x: number;
  y: number;
};
function copyRect(rect: DOMRect): Rect {
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    bottom: rect.bottom,
    x: rect.x,
    y: rect.y,
  };
}
