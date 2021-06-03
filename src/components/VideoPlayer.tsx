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
      import(
        /* webpackChunkName: "dashjs" */
        "dashjs"
      ).then(({ MediaPlayer }) => {
        console.log("Using Dash.js player");
        const player = MediaPlayer().create();
        player.initialize(video, srcDash, true);
      });
    } else {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = srcHls;
        video.play();
        console.log("Using native HLS support");
      } else {
        import(
          /* webpackChunkName: "hls.js" */
          "hls.js/dist/hls.light"
        ).then(({ default: Hls }) => {
          if (Hls.isSupported()) {
            console.log("Using Hls.js light player");
            const hls = new Hls();
            hls.loadSource(srcHls);
            hls.attachMedia(video);
            video.play();
          } else {
            throw new Error("No video player supported");
          }
        });
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
