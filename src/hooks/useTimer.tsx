import { useCallback, useEffect, useState } from "react";

export const useTimer = (options?: { loopAt: number | undefined }) => {
  const [second, setSecond] = useState(0);

  const reset = useCallback(() => {
    setSecond(0);
    console.log("resetting");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecond((second) => {
        if (options?.loopAt) {
          return (second + 1) % options.loopAt;
        }

        return second + 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [options?.loopAt]);

  return [second, reset] as const;
};
