import { useCallback, useEffect, useMemo, useState } from "react";

export const useTimer = (options?: {
  loopAt?: number;
  onTick?: (second: number, reset: () => void) => void;
}) => {
  const [second, setSecond] = useState(0);

  const loopAt = useMemo(() => options?.loopAt, [options?.loopAt]);
  const onTick = useMemo(() => options?.onTick, [options?.onTick]);

  const reset = useCallback(() => {
    setSecond(0);
    console.log("resetting");
  }, []);

  useEffect(() => {
    onTick?.(second, reset);
  }, [onTick, reset, second]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecond((second) => {
        if (loopAt) {
          return (second + 1) % loopAt;
        }

        return second + 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [loopAt]);

  return [second, reset] as const;
};
