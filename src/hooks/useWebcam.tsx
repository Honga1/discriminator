import { useEffect, useRef, useState } from "react";
import { useStore } from "../store/store";

export function useWebcam() {
  const webcamStream = useStore((state) => state.webcamStream);
  const webcamRef = useRef<HTMLVideoElement>(document.createElement("video"));
  const [aspect, setAspect] = useState(window.innerWidth / window.innerHeight);

  useEffect(() => {
    if (!webcamRef.current || !webcamStream) return;

    const video = webcamRef.current;

    if (video.srcObject !== webcamStream) {
      video.srcObject = webcamStream;
      video.play();
    }

    const track = webcamStream.getVideoTracks()[0]!;
    video.width = track.getSettings().width!;
    video.height = track.getSettings().height!;

    const videoAspect = video.width / video.height;

    setAspect(videoAspect);
  }, [webcamRef, webcamStream]);

  return { webcamRef, aspect };
}
