import createStoreHook from "zustand";
import create from "zustand/vanilla";
import { NonFunctionProperties } from "../@types/NonFunctionProperties";

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
        getCurrentTime: () => number;
        seekTimeDelta: (delta: number) => void;
        seekTime: (time: number) => void;
        setMuted: (isMuted: boolean) => void;
        setVolume: (volume: number) => void;
        isMuted: boolean;
        intention: "PLAY" | "PAUSE";
        progress: number;
        currentTime: number;
      }
    | undefined;
  toggleCamera: () => void;
  turnOnCamera: () => void;
  turnOffCamera: () => void;
  isCameraEnabled: boolean;
  isHeadingShown: boolean;
  isActive: boolean;
  webcamHTMLElement: HTMLVideoElement;
  webcamAspect: number;
};

const initialState: NonFunctionProperties<State> = {
  webcamStream: undefined,
  chapter: undefined,
  isHeadingShown: true,
  isCameraEnabled: true,
  isActive: true,
  webcamAspect: 4 / 3,
  webcamHTMLElement: document.createElement("video"),
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
      const webcam = get().webcamHTMLElement;
      webcam.srcObject = null;
      webcam.pause();
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
        const webcam = get().webcamHTMLElement.cloneNode() as HTMLVideoElement;

        if (webcam.srcObject !== stream) {
          webcam.srcObject = stream;
          webcam.muted = true;
          webcam.playsInline = true;
          webcam.play();
        }

        const track = stream.getVideoTracks()[0]!;
        webcam.width = track.getSettings().width!;
        webcam.height = track.getSettings().height!;

        const videoAspect = webcam.width / webcam.height;
        set({ webcamAspect: videoAspect, webcamHTMLElement: webcam });
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
          video: true,
          audio: false,
        })
        .then((stream) => resolve(stream))
        .catch((error) => {
          console.error("Something went wrong accessing webcam!");
          reject(error);
        });
    } catch (error) {
      console.error("Something went wrong accessing webcam!");
      reject(error);
    }
  });
}
