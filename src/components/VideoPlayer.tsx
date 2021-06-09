import { forwardRef, memo, useEffect, useRef } from "react";
import { useCombinedRef } from "../hooks/useCombinedRef";

export const VideoPlayer = memo(
  forwardRef<
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

      attachStreamerToVideo(video, srcDash, srcHls);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <video
        ref={combinedRef}
        {...props}
        disablePictureInPicture={true}
        playsInline
      ></video>
    );
  })
);

VideoPlayer.displayName = "VideoPlayer";

export function attachStreamerToVideo(
  video: HTMLVideoElement,
  srcDash: string,
  srcHls: string
) {
  if (!!window.MediaSource) {
    import(
      /* webpackChunkName: "dashjs" */
      "dashjs"
    ).then(({ MediaPlayer }) => {
      console.log("Using Dash.js player", srcDash);
      const player = MediaPlayer().create();
      player.initialize(video, srcDash, false);
    });
  } else {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = srcHls;
      video.onload = () => video.play();
      console.log("Using native HLS support", srcHls);
    } else {
      import(
        /* webpackChunkName: "hls.js" */
        "hls.js/dist/hls.light"
      ).then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          console.log("Using Hls.js light player", srcHls);
          const hls = new Hls();
          hls.loadSource(srcHls);
          hls.attachMedia(video);
        } else {
          throw new Error("No video player supported");
        }
      });
    }
  }
}
