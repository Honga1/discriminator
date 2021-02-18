import createStoreHook from "zustand";
import create, { SetState } from "zustand/vanilla";
type State = {
  webcamStream: MediaStream | undefined | "DISCONNECTED" | "NOT_USED";
  nextVideoToPlay: HTMLVideoElement | undefined;
  setWebcamStream(
    webcamStream: MediaStream | "DISCONNECTED" | "NOT_USED" | undefined
  ): void;
  setNextVideoToPlay(nextVideoToPlay: HTMLVideoElement | undefined): void;
  chapter:
    | {
        play: () => void;
        pause: () => void;
        rewind: () => void;
        setProgress: (progress: number) => void;
        getIsPlaying: () => boolean;
        getProgress: () => number;
        seekTimeDelta: (delta: number) => void;
        chapterNumber: number;
        intention: "PLAY" | "PAUSE";
        progress: number;
      }
    | undefined;
};

const initialState: NonFunctionProperties<State> = {
  webcamStream: undefined,
  nextVideoToPlay: undefined,
  chapter: undefined,
};
export const store = create<State>((set, get) => {
  const setWithLog: SetState<State> = (partial, replace) => {
    console.log("Changed state with partial:");
    console.table(partial);
    set(partial, replace);
  };
  return {
    ...initialState,
    setWebcamStream(webcamStream: MediaStream | "NOT_USED") {
      setWithLog({ webcamStream });
    },
    setNextVideoToPlay(nextVideoToPlay: HTMLVideoElement | undefined) {
      setWithLog({ nextVideoToPlay });
    },
  };
});

export const useStore = createStoreHook(store);

// Type helpers
type CallbackFunctionVariadic = (...args: never[]) => void;
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends CallbackFunctionVariadic ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;
