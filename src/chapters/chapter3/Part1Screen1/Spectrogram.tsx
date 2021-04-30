import { memo, useRef } from "react";
import { useAnimationFrame } from "src/hooks/useAnimationFrame";

export const Spectrogram = memo(
  ({ getByteData }: { getByteData: () => Uint8Array }) => {
    const heightFactor = 390 / numBars;
    const rects = useRef<(SVGRectElement | null)[]>(
      Array.from({ length: numBars })
    );
    const ref = useRef<SVGSVGElement>(null);

    useAnimationFrame(20, () => {
      const data = getByteData();

      let min = Infinity;
      let max = -Infinity;

      data.forEach((datum) => {
        min = Math.min(min, datum);
        max = Math.max(max, datum);
      });

      const range = 64;

      for (let index = 0; index < rects.current.length; index++) {
        const scale = Math.min(
          (data[index]! - min) / range + 0.2 * randomHeightScales[index]!,
          1.0
        );
        const rect = rects.current[index];
        rect?.setAttribute(
          `transform`,
          `matrix(1, 0, 0, ${scale}, ${heightFactor * index}, 0)`
        );
      }
    });

    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 390 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
      >
        {rects.current.map((value, index) => {
          return (
            <rect
              ref={(ref) => (rects.current[index] = ref)}
              fill="#E8C100"
              key={index}
              width={3}
              height={101}
              transform={`matrix(1, 0, 0, 1, ${heightFactor * index}, 0)`}
              style={{ transformOrigin: "left center" }}
            />
          );
        })}
      </svg>
    );
  }
);

const numBars = 48;
const randomHeightScales = Array.from({ length: numBars }).map(
  () => 1 + (Math.random() - 0.5) / 5
);
