import { useRef } from "react";
import { DashPlayer } from "src/components/DashPlayer";
import { useChapter } from "src/hooks/useChapter";

export default function Chapter4() {
  const ref = useRef<HTMLVideoElement>(null);
  useChapter(ref, false);

  return (
    <DashPlayer
      ref={ref}
      style={{
        boxSizing: "border-box",
        outline: "none",
        width: "100%",
        height: "100%",
      }}
      width="100%"
      height="100%"
      src={`https://discriminator-media-server.jaeperris.com/part4/stream.mpd`}
    ></DashPlayer>
  );
}
