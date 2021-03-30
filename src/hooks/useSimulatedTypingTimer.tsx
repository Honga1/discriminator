import { useCallback, useEffect, useMemo, useState } from "react";

export const useSimulatedTypingTimer = (options?: {
  initialTime?: number;
  startPaused?: boolean;
  loopAt?: number;
  onTick?: (second: number, reset: () => void, stop: () => void) => void;
  typeRate?: number;
}) => {
  const [stroke, setSecond] = useState(options?.initialTime ?? 0);
  const [state, setState] = useState<"RUNNING" | "STOPPED">(
    !!options?.startPaused ? "STOPPED" : "RUNNING"
  );

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

  const start = useCallback(() => {
    setState("RUNNING");
    console.log("timer starting");
  }, []);

  useEffect(() => {
    onTick?.(stroke, reset, stop);
  }, [onTick, reset, stroke, stop]);

  useEffect(() => {
    if (state === "RUNNING") {
      const interval = setInterval(() => {
        setSecond((second) => {
          if (loopAt) {
            return (second + 1) % loopAt;
          }

          return second + 1;
        });
      }, options?.typeRate ?? 100);
      return () => {
        clearInterval(interval);
      };
    }
  }, [loopAt, options?.typeRate, state]);

  return [stroke, reset, stop, start] as const;
};
