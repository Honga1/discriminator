import { useEffect, useRef } from "react";

export function useCombinedRef<T extends any>(
  ...refs: Array<
    React.MutableRefObject<T | null> | ((instance: T | null) => void) | null
  >
) {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (ref === null) return;

      if (typeof ref === "function") {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
