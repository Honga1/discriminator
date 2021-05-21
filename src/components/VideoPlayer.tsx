import { MediaPlayer } from "dashjs";
import Hls from "hls.js";
import { forwardRef, useEffect, useRef } from "react";
import { useCombinedRef } from "../hooks/useCombinedRef";

export const VideoPlayer = forwardRef<
  HTMLVideoElement,
  Omit<
    React.DetailedHTMLProps<
      React.VideoHTMLAttributes<HTMLVideoElement>,
      HTMLVideoElement
    >,
    "src"
  > & { srcDash: string; srcHls: string }
>(({ srcDash, srcHls, ...props }, ref) => {
  const innerRef = useRef<HTMLVideoElement>(null);
  const combinedRef = useCombinedRef(ref, innerRef);

  useEffect(() => {
    const video = combinedRef.current;
    if (!video) return;

    if (!!window.MediaSource) {
      console.log("Using Dash.js player");
      const player = MediaPlayer().create();
      player.initialize(video, srcDash, true);
    } else {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = srcHls;
        video.play();
        console.log("Using native HLS support");
      } else if (Hls.isSupported()) {
        console.log("Using Hls.js player");
        const hls = new Hls();
        hls.loadSource(srcHls);
        hls.attachMedia(video);
        video.play();
      }
    }
  }, [combinedRef, srcDash, srcHls]);

  return (
    <video
      ref={combinedRef}
      {...props}
      disablePictureInPicture={true}
      playsInline
    ></video>
  );
});

VideoPlayer.displayName = "VideoPlayer";
