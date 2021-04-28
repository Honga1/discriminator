import { ComponentPropsWithoutRef, useRef } from "react";
import { useResize } from "src/hooks/useResize";
import { CSSProperties } from "styled-components";

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

  const { rect } = useResize(parent);

  let width: CSSProperties["width"];
  let height: CSSProperties["height"];

  if (rect !== undefined) {
    if (rect.width > rect.height) {
      width = rect.height + "px";
      height = rect.height + "px";
    } else {
      height = rect.width + "px";
      width = rect.width + "px";
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
