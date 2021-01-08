import createStoreHook from "zustand";
import create, { SetState } from "zustand/vanilla";
import { ProgressNames } from "./Progress";

type State = {
  progress: ProgressNames;
  webcamStream: MediaStream | undefined | "DISCONNECTED" | "NOT_USED";
  setProgress(progress: ProgressNames): void;
  setWebcamStream(
    webcamStream: MediaStream | "DISCONNECTED" | "NOT_USED"
  ): void;
};

const initialState: NonFunctionProperties<State> = {
  progress: "COVER_1",
  webcamStream: undefined,
};
export const store = create<State>((set, get) => {
  const setWithLog: SetState<State> = (partial, replace) => {
    console.log("Changed state with partial:");
    console.table(partial);
    set(partial, replace);
  };
  return {
    ...initialState,
    setProgress(progress: ProgressNames) {
      setWithLog({ progress });
    },
    setWebcamStream(webcamStream: MediaStream | "NOT_USED") {
      setWithLog({ webcamStream });
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
