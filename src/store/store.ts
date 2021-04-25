import createActivityDetector from "activity-detector";
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
  turnOffCamera: () => void;
  isCameraEnabled: boolean;
  isHeadingShown: boolean;
  isActive: boolean;
};

const initialState: NonFunctionProperties<State> = {
  webcamStream: undefined,
  chapter: undefined,
  isHeadingShown: true,
  isCameraEnabled: true,
  isActive: false,
};

export const store = create<State>((set, get) => ({
  ...initialState,
  toggleCamera: () => {
    const maybeStream = get().webcamStream;
    const isOn = maybeStream !== undefined;
    if (isOn) {
      get().turnOffCamera();
    } else {
      get().turnOnCamera();
    }
  },
  turnOffCamera: () => {
    localStorage.setItem("isWebcamWanted", "false");
    const maybeStream = get().webcamStream;
    const isOn = maybeStream !== undefined;
    if (isOn) {
      const stream = maybeStream!;
      stream.getTracks().forEach((track) => track.stop());
      set({ webcamStream: undefined });
    }
  },
  turnOnCamera: async () => {
    localStorage.setItem("isWebcamWanted", "true");
    const webcamIsOpen = get().webcamStream !== undefined;
    if (webcamIsOpen) return;

    getWebcam()
      .then((stream) => {
        stream.getTracks().forEach((track) => {
          track.addEventListener("ended", () => {
            set({ webcamStream: undefined });
          });
          set({ webcamStream: stream });
        });
      })
      .catch((error) => console.error(error));
  },
}));

if (localStorage.getItem("isWebcamWanted") === "true") {
  store.getState().turnOnCamera();
} else {
  store.getState().turnOffCamera();
}

export const useStore = createStoreHook(store);

// Type helpers
type CallbackFunctionVariadic = (...args: never[]) => void;
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends CallbackFunctionVariadic ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

function getWebcam() {
  return new Promise<MediaStream>((resolve, reject) => {
    const canGetWebcam =
      !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;

    if (!canGetWebcam) {
      reject("Could not access navigator.mediaDevices");
      return;
    }
    try {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            aspectRatio: 4 / 3,
            width: 320,
            height: 240,
          },
        })
        .then((stream) => resolve(stream))
        .catch((error) => {
          console.log("Something went wrong accessing webcam!");
          reject(error);
        });
    } catch (error) {
      console.log("Something went wrong accessing webcam!");
      reject(error);
    }
  });
}

const activityDetector = createActivityDetector({
  timeToIdle: 4000,
});

activityDetector.on("idle", () => {
  store.setState({ isActive: false });
});

activityDetector.on("active", () => {
  store.setState({ isActive: true });
});
