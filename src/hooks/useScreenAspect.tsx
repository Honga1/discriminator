import { useEffect, useState } from "react";

export const useScreenAspect = () => {
  const [aspect, setAspect] = useState(window.innerWidth / window.innerHeight);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setAspect(window.innerWidth / window.innerHeight);
    });
    return () => {};
  }, []);

  return aspect;
};
