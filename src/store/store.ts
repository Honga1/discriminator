import createStoreHook from "zustand";
import create from "zustand/vanilla";
type State = {
  webcamStream: MediaStream | undefined;
  chapter:
    | {
        play: () => void;
        pause: () => void;
        rewind: () => void;
        setProgress: (progress: number) => void;
        getIsPlaying: () => boolean;
        getProgress: () => number;
        seekTimeDelta: (delta: number) => void;
        intention: "PLAY" | "PAUSE";
        progress: number;
      }
    | undefined;
  toggleCamera: () => void;
  turnOnCamera: () => void;
  isCameraEnabled: boolean;
  isHeadingShown: boolean;
};

const initialState: NonFunctionProperties<State> = {
  webcamStream: undefined,
  chapter: undefined,
  isHeadingShown: true,
  isCameraEnabled: true,
};

export const store = create<State>((set, get) => {
  return {
    ...initialState,
    toggleCamera: () => {
      const maybeStream = get().webcamStream;
      const isOn = maybeStream !== undefined;
      if (isOn) {
        const stream = maybeStream!;
        stream.getTracks().forEach((track) => track.stop());
        set({ webcamStream: undefined });
      } else {
        get().turnOnCamera();
      }
    },
    turnOnCamera: () => {
      if (
        navigator.mediaDevices.getUserMedia &&
        get().webcamStream === undefined
      ) {
        navigator.mediaDevices
          .getUserMedia({ video: { aspectRatio: 4 / 3 } })
          .then((stream) => {
            set({ webcamStream: stream });
            stream.getTracks().forEach((track) => {
              track.addEventListener("ended", () => {
                set({ webcamStream: undefined });
              });
            });
          })
          .catch((error) => {
            console.log("Something went wrong accessing webcam!");
            console.log(error);
          });
      }
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
