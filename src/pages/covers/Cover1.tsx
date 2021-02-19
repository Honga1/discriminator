import { useEffect, useRef } from "react";

export const Cover1 = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maybeContext = canvas.getContext("2d");
    if (!maybeContext) return;
    contextRef.current = maybeContext;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const paint = (pointerX: number, pointerY: number) => {
      const context = contextRef.current;
      if (!context) return;

      requestAnimationFrame(() => {
        for (let x = pointerX - 10; x < pointerX + 10; x++) {
          for (let y = pointerY - 10; y < pointerY + 10; y++) {
            context.fillStyle = `hsl(${
              (x * Math.sin(Date.now() / 10000)) % 255
            }, 100%, 50%)`;
            context.beginPath();

            context.ellipse(x, y, 10, 10, 0, 0, 2 * Math.PI);
            context.fill();
          }
        }
      });
    };
    const onMouseMove = (event: MouseEvent): void => {
      if (!canvasRef.current) return;
      const { relativeX, relativeY } = getRelativeClickPosition(
        event,
        canvasRef.current
      );

      const x = relativeX * canvasRef.current?.width;
      const y = relativeY * canvasRef.current?.height;
      if (x !== undefined && y !== undefined) {
        paint(x, y);
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const onTouchMove = (event: TouchEvent): void => {
      if (!canvasRef.current) return;
      const { relativeX, relativeY } = getRelativeTouchPosition(
        event,
        canvasRef.current
      );

      const x = relativeX * canvasRef.current.width;
      const y = relativeY * canvasRef.current.height;
      if (x !== undefined && y !== undefined) {
        paint(x, y);
      }
    };
    window.addEventListener("touchmove", onTouchMove);

    const onWindowResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return (
    <canvas
      style={{ width: "100%", height: "100%" }}
      width={window.innerWidth}
      height={window.innerHeight}
      ref={canvasRef}
    ></canvas>
  );
};

function getRelativeTouchPosition(
  event: TouchEvent,
  target: HTMLCanvasElement
): { relativeX: number; relativeY: number } {
  const screenX = event.changedTouches[0].clientX;
  const screenY = event.changedTouches[0].clientY;
  const rect = target.getBoundingClientRect();

  const clip = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(value, min));

  const clippedX = clip(screenX - rect.left, 0, rect.width - 1);
  const clippedY = clip(screenY - rect.top, 0, rect.height - 1);

  const relativeX = clippedX / rect.width;
  const relativeY = clippedY / rect.height;
  return { relativeX: relativeX, relativeY: relativeY };
}

function getRelativeClickPosition(
  event: MouseEvent,
  target: HTMLCanvasElement
): { relativeX: number; relativeY: number } {
  const screenX = event.clientX;
  const screenY = event.clientY;
  const rect = target.getBoundingClientRect();

  const clip = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(value, min));

  const clippedX = clip(screenX - rect.left, 0, rect.width - 1);
  const clippedY = clip(screenY - rect.top, 0, rect.height - 1);

  const relativeX = clippedX / rect.width;
  const relativeY = clippedY / rect.height;
  return { relativeX: relativeX, relativeY: relativeY };
}
