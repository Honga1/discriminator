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
    const paint = (pointerX: number, pointerY: number) => {
      const context = contextRef.current;
      if (!context) return;

      requestAnimationFrame(() => {
        for (let x = pointerX - 10; x < pointerX + 10; x++) {
          for (let y = pointerY - 10; y < pointerY + 10; y++) {
            context.fillStyle = `hsl(${x % 255}, 100%, 50%)`;
            context.beginPath();

            context.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI);
            context.fill();
          }
        }
      });
    };
    window.addEventListener("mousemove", (event) => {
      const x = event.clientX;
      const y = event.clientY;
      paint(x, y);
    });
  });

  return (
    <canvas
      style={{ width: "100%", height: "100%" }}
      width={window.innerWidth}
      height={window.innerHeight}
      ref={canvasRef}
    ></canvas>
  );
};
