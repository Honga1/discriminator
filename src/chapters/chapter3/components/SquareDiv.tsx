import { ComponentPropsWithoutRef, useRef } from "react";
import { CSSProperties } from "styled-components";
import useResizeObserver from "use-resize-observer";

export const SquareDiv = ({
  children,
  style,
  maxHeight = "100%",
  maxWidth = "100%",
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  maxWidth?: CSSProperties["maxWidth"];
  maxHeight?: CSSProperties["maxHeight"];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const parent = useRef<HTMLDivElement>(null);

  const { width: containerWidth, height: containerHeight } = useResizeObserver({
    ref: parent,
  });

  let width: CSSProperties["width"];
  let height: CSSProperties["height"];

  if (containerWidth !== undefined && containerHeight !== undefined) {
    if (containerWidth > containerHeight) {
      width = containerHeight + "px";
      height = containerHeight + "px";
    } else {
      height = containerWidth + "px";
      width = containerWidth + "px";
    }
  }

  return (
    <div
      ref={parent}
      style={{
        width: maxWidth,
        height: maxHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div ref={ref} style={{ ...style, width, height }} {...props}>
        {children}
      </div>
    </div>
  );
};
