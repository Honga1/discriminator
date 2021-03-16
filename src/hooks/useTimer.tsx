import { useCallback, useEffect, useMemo, useState } from "react";

export const useTimer = (options?: {
  initialTime?: number;
  loopAt?: number;
  onTick?: (second: number, reset: () => void, stop: () => void) => void;
}) => {
  const [second, setSecond] = useState(options?.initialTime ?? 0);
  const [state, setState] = useState<"RUNNING" | "STOPPED">("RUNNING");

  const loopAt = useMemo(() => options?.loopAt, [options?.loopAt]);
  const onTick = useMemo(() => options?.onTick, [options?.onTick]);

  const reset = useCallback(() => {
    setSecond(0);
    console.log("timer resetting");
  }, []);

  const stop = useCallback(() => {
    setState("STOPPED");
    console.log("timer stopping");
  }, []);

  useEffect(() => {
    onTick?.(second, reset, stop);
  }, [onTick, reset, second, stop]);

  useEffect(() => {
    if (state === "RUNNING") {
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
    }
  }, [loopAt, state]);

  return [second, reset, stop] as const;
};
