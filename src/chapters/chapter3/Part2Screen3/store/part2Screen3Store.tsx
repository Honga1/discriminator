import { default as createStore } from "zustand";
import create from "zustand/vanilla";

export const part2Screen3Store = create<{
  sprites: Set<{ current: HTMLSpanElement | null }>;
  container: { current: HTMLSpanElement | null } | undefined;
  isInteractive: boolean;
}>((set, get) => ({
  container: undefined,
  isInteractive: false,
  sprites: new Set<{ current: HTMLSpanElement | null }>(),
}));
export const usePart2Screen3Store = createStore(part2Screen3Store);
