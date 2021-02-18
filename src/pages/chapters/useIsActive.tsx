import { Timeout } from "grommet";
import { useEffect, useState } from "react";

export function useIsActive() {
  const [isActive, setIsActive] = useState(true);
  useEffect(() => {
    let timeout: Timeout | undefined;
    const onActivity = () => {
      setIsActive(true);
      if (timeout) clearTimeout(timeout);

      timeout = (setTimeout(() => {
        setIsActive(false);
      }, 4000) as unknown) as number;
    };
    window.addEventListener("mousemove", onActivity);

    return () => {
      timeout && clearTimeout(timeout);
      window.removeEventListener("mousemove", onActivity);
    };
  }, []);

  return isActive;
}
