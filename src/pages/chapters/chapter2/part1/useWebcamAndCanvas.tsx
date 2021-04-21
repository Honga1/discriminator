import React, { useEffect, useState } from "react";
import { V2 } from "../../../../libs/v2";

export function useWebcamAndCanvas(
  webcamRef: React.RefObject<HTMLVideoElement>,
  videoRef: React.RefObject<HTMLVideoElement>,
  webcamStream: MediaStream | undefined
) {
  const { rect } = useResize(videoRef);

  const [[canvasWidth, canvasHeight], setCanvasSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

  useEffect(() => {
    if (!webcamRef.current || !rect || !webcamStream || !videoRef.current)
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
    const width = Math.min(rect.width, rect.height * videoAspect);
    const height = Math.min(rect.width / videoAspect, rect.height);
    setCanvasSize([width, height]);
  }, [rect, videoRef, webcamRef, webcamStream]);

  return [canvasWidth, canvasHeight] as V2;
}

function useResize(element: React.RefObject<HTMLElement>) {
  let [{ screenWidth, screenHeight, aspect, rect }, setState] = useState<{
    screenWidth: number;
    screenHeight: number;
    aspect: number;
    rect: Rect | undefined;
  }>({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    aspect: window.innerWidth / window.innerHeight,
    rect:
      element?.current !== null
        ? copyRect(element.current.getBoundingClientRect())
        : undefined,
  });

  const onResize = () => {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    aspect = screenWidth / screenHeight;

    if (element && element.current) {
      const clientRect = element.current.getBoundingClientRect();
      rect = copyRect(clientRect);
    }

    setState({
      screenWidth,
      screenHeight,
      aspect,
      rect,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", onResize, false);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { screenWidth, screenHeight, aspect, rect };
}

type Rect = {
  width: number;
  height: number;
  top: number;
  bottom: number;
  x: number;
  y: number;
};

function copyRect(rect: DOMRect): Rect {
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    bottom: rect.bottom,
    x: rect.x,
    y: rect.y,
  };
}
