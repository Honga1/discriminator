import { useRef } from "react";
import videoSrc from "./../../p4.mp4";
import { useChapter } from "../../hooks/useChapter";

export default function Chapter4() {
  const ref = useRef<HTMLVideoElement>(null);
  useChapter(ref, false);

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
