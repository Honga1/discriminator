import { useRef, useCallback, useEffect } from "react";

export const useAnimationFrame = (
  frameRate: number,
  callback: (deltaTime: number) => void
): void => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
    },
    [callback]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      requestRef.current = requestAnimationFrame(animate);
    }, 1000 / frameRate);
    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current);
      interval && clearInterval(interval);
    };
  }, [animate, frameRate]);
};

export const useOverrideAnimationFrame = (
  frameRate: number,
  callback: (deltaTime: number) => Promise<void>
): void => {
  const isProcessing = useRef(false);

  useAnimationFrame(frameRate, async (deltaTime) => {
    if (isProcessing.current === true) {
      return;
    }
    isProcessing.current = true;
    callback(deltaTime).finally(() => {
      isProcessing.current = false;
    });
  });
};
