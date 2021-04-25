import { useStore } from "../store/store";

export function useIsActive() {
  return useStore((state) => state.isActive);
}
