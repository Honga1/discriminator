import { useState, useEffect, useMemo } from "react";

export function useAnimationSequence<T extends any[]>(switchValue: T) {
  const memoSwitchValue = useMemo(() => {
    return [...switchValue];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...switchValue]);

  const [incomingPages, setIncomingPages] = useState<T[][]>([]);
  const [currentPage, setCurrentPage] = useState(memoSwitchValue);

  const [stage, setStage] =
    useState<"ANIMATE_OUT" | "ANIMATE_IN" | "REST">("REST");

  useEffect(() => {
    setIncomingPages((existingPages) => [...existingPages, memoSwitchValue]);
  }, [memoSwitchValue]);

  useEffect(() => {
    if (currentPage === memoSwitchValue) return;

    setStage("ANIMATE_OUT");
    let animateInTimeout: number | undefined;
    const animateOutTimeout = setTimeout(() => {
      setCurrentPage(incomingPages.pop() ?? currentPage);
      setIncomingPages([]);

      setStage("ANIMATE_IN");
      animateInTimeout = setTimeout(() => {
        setStage("REST");
      }, 1000) as unknown as number;
    }, 1000);

    return () => {
      animateInTimeout && clearTimeout(animateInTimeout);
      clearTimeout(animateOutTimeout);
    };
  }, [currentPage, incomingPages, memoSwitchValue, switchValue]);

  const result = useMemo(() => {
    return [currentPage, stage] as [T, "ANIMATE_OUT" | "ANIMATE_IN" | "REST"];
  }, [currentPage, stage]);

  return result;
}
