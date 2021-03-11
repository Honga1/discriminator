import { useRef } from "react";
import videoSrc from "./../../../720p.mp4";
import { useChapter } from "../../../hooks/useChapter";
export default function Chapter3() {
  const ref = useRef<HTMLVideoElement>(null);
  useChapter(ref);

  return (
    <video
      ref={ref}
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
