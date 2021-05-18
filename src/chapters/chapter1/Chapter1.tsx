import { useRef } from "react";
import { useChapter } from "../../hooks/useChapter";
import { DashPlayer } from "../../components/DashPlayer";
export default function Chapter1() {
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
      src={`https://discriminator-media-server.jaeperris.com/part1/stream.mpd`}
    ></DashPlayer>
  );
}
