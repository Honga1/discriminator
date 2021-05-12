import { default as createStore } from "zustand";
import create from "zustand/vanilla";

export const part2Screen3Store = create<{
  sprites: Set<{ current: HTMLSpanElement | null }>;
  container: { current: HTMLSpanElement | null } | undefined;
  currentPlayingAudio: undefined | HTMLAudioElement;
}>((set, get) => ({
  container: undefined,
  sprites: new Set<{ current: HTMLSpanElement | null }>(),
  currentPlayingAudio: undefined,
}));
export const usePart2Screen3Store = createStore(part2Screen3Store);
