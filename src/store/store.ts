import { generateUUID } from "three/src/math/MathUtils";
import createStoreHook from "zustand";
import create from "zustand/vanilla";
import { NonFunctionProperties } from "../@types/NonFunctionProperties";

type State = {
  photo: FormData | undefined;
  webcamDisabledInSystemNotification: boolean;
  session: string;
  firstLoad: boolean;
  allowed: boolean;
  webcamStream: MediaStream | undefined;
  chapter:
    | {
        element: HTMLVideoElement | HTMLAudioElement;
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
  turnOnCamera: () => Promise<void>;
  turnOffCamera: () => void;
  submitToAi: () => Promise<void>;
  isCameraEnabled: boolean;
  isHeadingShown: boolean;
  isActive: boolean;
  webcamHTMLElement: HTMLVideoElement;
  webcamAspect: number;
};

const initialState: NonFunctionProperties<State> = {
  webcamDisabledInSystemNotification: false,
  session: generateUUID(),
  firstLoad: true,
  allowed: localStorage.getItem("allowed") === "true" ?? false,
  webcamStream: undefined,
  chapter: undefined,
  isHeadingShown: true,
  isCameraEnabled: false,
  isActive: true,
  webcamAspect: 4 / 3,
  photo: undefined,
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

    return getWebcam()
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

  async submitToAi() {
    const photo = get().photo;
    if (!photo) return;
    console.log("Submitting to AI");
    return fetch(`https://discriminator-ai.jaeperris.com/add-video`, {
      method: "POST",
      body: photo,
      mode: "no-cors",
    }).then(async (response) => {
      if (response.status === 500) {
        console.error(await response.text());
      } else {
        const src = await response.text();
        console.log(src);
      }
    });
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
          if (error.name === "NotAllowedError") {
            console.warn(error);
            store.setState({ webcamDisabledInSystemNotification: true });
          } else {
            console.error("Something went wrong accessing webcam!");
            store.setState({ webcamDisabledInSystemNotification: true });
            reject(error);
          }
        });
    } catch (error) {
      store.setState({ webcamDisabledInSystemNotification: true });
      console.error("Something went wrong accessing webcam!");
      reject(error);
    }
  });
}
