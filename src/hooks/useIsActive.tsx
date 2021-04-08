import { Timeout } from "grommet";
import { useEffect, useState } from "react";

const listeners = new Set<(state: boolean) => void>();
const addListener = (setIsActive: (state: boolean) => void) => {
  if (listeners.size === 0) {
    install();
  }
  listeners.add(setIsActive);

  return () => {
    listeners.delete(setIsActive);
    if (listeners.size === 0) {
      uninstall();
    }
  };
};

const setIsActive = (state: boolean) => {
  listeners.forEach((listener) => listener(state));
};

let timeout: Timeout | undefined;
const onActivity = () => {
  setIsActive(true);
  if (timeout) clearTimeout(timeout);

  timeout = (setTimeout(() => {
    setIsActive(false);
  }, 4000) as unknown) as number;
};

const install = () => {
  window.addEventListener("mousemove", onActivity);
  window.addEventListener("touchstart", onActivity);
};

const uninstall = () => {
  timeout && clearTimeout(timeout);
  window.removeEventListener("mousemove", onActivity);
  window.removeEventListener("touchstart", onActivity);
};

export function useIsActive() {
  const [isActive, setIsActive] = useState(true);
  useEffect(addListener(setIsActive), []);
  return isActive;
}
