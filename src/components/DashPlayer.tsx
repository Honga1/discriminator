import { MediaPlayer } from "dashjs";
import { forwardRef, useEffect, useRef } from "react";
import { useCombinedRef } from "../hooks/useCombinedRef";

export const DashPlayer = forwardRef<
  HTMLVideoElement,
  React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  >
>(({ src, ...props }, ref) => {
  const innerRef = useRef<HTMLVideoElement>(null);
  const combinedRef = useCombinedRef(ref, innerRef);

  useEffect(() => {
    if (!combinedRef.current) return;
    const player = MediaPlayer().create();
    player.initialize(combinedRef.current, src, true);
  }, [combinedRef, src]);

  return (
    <video ref={combinedRef} {...props} disablePictureInPicture={true}></video>
  );
});

DashPlayer.displayName = "DashPlayer";
