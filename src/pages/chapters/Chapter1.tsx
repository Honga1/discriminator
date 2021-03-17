import { useRef } from "react";
import videoSrc from "./../../p1.mp4";
import { useChapter } from "../../hooks/useChapter";
import { IMediaElement } from "../../IMediaElement";
export default function Chapter1() {
  const ref = useRef<IMediaElement>(null);
  useChapter(ref);

  return (
    <video
      ref={ref as any}
      style={{
        boxSizing: "border-box",
        outline: "none",
        width: "100%",
        height: "100%",
      }}
      width="100%"
      height="100%"
      src={videoSrc}
    ></video>
  );
}
