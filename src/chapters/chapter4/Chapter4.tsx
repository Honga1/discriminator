import { useRef } from "react";
import { useChapter } from "src/hooks/useChapter";
import ReactPlayer from "react-player";

export default function Chapter4() {
  const ref = useRef<HTMLVideoElement>(null);
  useChapter(ref, false);

  return (
    <ReactPlayer
      ref={(incoming) => ((ref as any).current = incoming?.getInternalPlayer())}
      style={{
        boxSizing: "border-box",
        outline: "none",
        width: "100%",
        height: "100%",
      }}
      width="100%"
      height="100%"
      url={`https://discriminator-media-server.jaeperris.com/part4/stream.mpd`}
    ></ReactPlayer>
  );
}
