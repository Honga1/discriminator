import React, { useEffect, useState } from "react";
import useResizeObserver from "use-resize-observer";
import { V2 } from "./V2";

export function useWebcamAndCanvas(
  webcamRef: React.RefObject<HTMLVideoElement>,
  webcamStream: MediaStream | undefined
) {
  const { width: videoDivWidth, height: videoDivHeight } = useResizeObserver({
    ref: webcamRef,
  });

  const [[canvasWidth, canvasHeight], setCanvasSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    if (
      !webcamRef.current ||
      !videoDivWidth ||
      !videoDivHeight ||
      !webcamStream
    )
      return;
    const video = webcamRef.current;

    if (video.srcObject !== webcamStream) {
      video.srcObject = webcamStream;
      video.play();
    }

    const track = webcamStream.getVideoTracks()[0]!;
    video.width = track.getSettings().width!;
    video.height = track.getSettings().height!;

    const videoAspect = video.width / video.height;
    const width = Math.min(videoDivWidth, videoDivHeight * videoAspect);
    const height = Math.min(videoDivWidth / videoAspect, videoDivHeight);
    setCanvasSize([width, height]);
  }, [videoDivHeight, videoDivWidth, webcamRef, webcamStream]);

  return [canvasWidth, canvasHeight] as V2;
}
