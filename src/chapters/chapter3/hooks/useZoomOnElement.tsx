import { ResponsiveContext } from "grommet";
import { useContext, useEffect } from "react";
import { config, SpringRef, SpringValue } from "react-spring";

export function useZoomOnElement(
  ref: { current: HTMLElement | null },
  focusedElement: HTMLElement | undefined,
  api: SpringRef<{
    drag: boolean;
    x: number;
    y: number;
    scale: number;
  }>,
  x: SpringValue<number>,
  scale: SpringValue<number>,
  y: SpringValue<number>,
  part: 1 | 3
) {
  const isSmall = useContext(ResponsiveContext) === "small";

  useEffect(() => {
    if (!ref.current) return;
    if (!focusedElement) {
      api.start({
        x: 0,
        y: 0,
        scale: 1,
        config: config.molasses,
      });
      return;
    }

    const container = ref.current;

    const bb = focusedElement.getBoundingClientRect();
    const containerBb = container.getBoundingClientRect();

    const maxWidth = containerBb.width * (isSmall ? 0.9 : 0.8);
    const maxHeight = containerBb.height * (isSmall ? 0.9 : 0.8);

    const scaleY = maxHeight / bb.height;
    const scaleX = maxWidth / bb.width;
    const minScale = Math.min(scaleY, scaleX);

    const alignLeft =
      isSmall || part === 3
        ? (part === 1 ? 0 : -containerBb.width * 0.1) / minScale
        : (containerBb.width * 0.2) / minScale;
    const alignTop = !isSmall ? 0 : (containerBb.height * 0.2) / minScale;
    const distanceFromCenterX =
      (bb.left + bb.right) / 2 -
      containerBb.width / 2 +
      containerBb.left +
      alignLeft;
    const distanceFromCenterY =
      (bb.top + bb.bottom) / 2 -
      containerBb.height / 2 +
      containerBb.top +
      alignTop;

    api.start({
      x: x.get() - distanceFromCenterX / scale.get(),
      y: y.get() - distanceFromCenterY / scale.get(),
      scale: minScale * scale.get(),
      config: config.molasses,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedElement]);
}
