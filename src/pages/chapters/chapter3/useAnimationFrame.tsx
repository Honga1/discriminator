import { useCallback, useEffect, useRef } from "react";

export const useAnimationFrame = (
  frameRate: number,
  callback: (deltaTime: number) => Promise<void> | void
): void => {
  const requestRef = useRef<number>();
  const timeoutRef = useRef<number>();
  const previousTimeRef = useRef<number>(Date.now());
  const frameInterval = 1000 / frameRate;

  const animate = useCallback(
    async (time: number) => {
      const deltaTime = time - previousTimeRef.current;
      await new Promise((resolve) => resolve(callback(deltaTime)));

      previousTimeRef.current = time;

      timeoutRef.current = (setTimeout(() => {
        requestRef.current = requestAnimationFrame(animate);
      }, frameInterval) as unknown) as number;
    },
    [callback, frameInterval]
  );

  useEffect(() => {
    timeoutRef.current = (setTimeout(() => {
      requestRef.current = requestAnimationFrame(animate);
    }, frameInterval) as unknown) as number;
    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current);
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [animate, frameInterval]);
};
