import { useRef } from "react";
import { VideoPlayer } from "../../components/VideoPlayer";
import { useChapter } from "../../hooks/useChapter";
export default function Chapter1() {
  const ref = useRef<HTMLVideoElement>(null);
  useChapter(ref, false);

  return (
    <VideoPlayer
      ref={ref}
      style={{
        boxSizing: "border-box",
        outline: "none",
        width: "100%",
        height: "100%",
      }}
      width="100%"
      height="100%"
      srcDash={`https://discriminator-media-server.jaeperris.com/part1/stream.mpd`}
      srcHls={`https://discriminator-media-server.jaeperris.com/part1/master.m3u8`}
    ></VideoPlayer>
  );
}
