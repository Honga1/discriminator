import { MutableRefObject, useEffect, useRef } from "react";

export const useForwardedRef = <T extends any>(
  ref: ((instance: T | null) => void) | MutableRefObject<T | null> | null
) => {
  const innerRef = useRef<T>(null);
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      // eslint-disable-next-line no-param-reassign
      ref.current = innerRef.current;
    }
  });

  return innerRef;
};
