import { useEffect, useMemo, useState } from "react";
import { useStore } from "../store/store";

export function useWebcam() {
  const webcamStream = useStore((state) => state.webcamStream);
  const webcam = useMemo(() => document.createElement("video"), []);
  const [aspect, setAspect] = useState(window.innerWidth / window.innerHeight);

  useEffect(() => {
    if (!webcamStream) return;

    if (webcam.srcObject !== webcamStream) {
      webcam.srcObject = webcamStream;
      webcam.play();
    }

    const track = webcamStream.getVideoTracks()[0]!;
    webcam.width = track.getSettings().width!;
    webcam.height = track.getSettings().height!;

    const videoAspect = webcam.width / webcam.height;

    setAspect(videoAspect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcamStream]);

  return { webcam, aspect };
}
