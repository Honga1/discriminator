import { useEffect, useState } from "react";

export const useResize = () => {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const onResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return dimensions;
};
