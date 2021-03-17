import { useRef } from "react";
import videoSrc from "./../../p1.mp4";
import { useSingleMediaChapter } from "../../hooks/useSingleMediaChapter";
export default function Chapter1() {
  const ref = useRef<HTMLVideoElement>(null);
  useSingleMediaChapter(ref);

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
