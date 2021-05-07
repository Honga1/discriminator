import { memo } from "react";
import { FadeOutBox } from "./FadeOutBox";

export const ScrollBanner = memo(({ isShown }: { isShown: boolean }) => {
  return (
    <FadeOutBox
      height="145px"
      style={{
        position: "absolute",
        pointerEvents: "none",
        background:
          "linear-gradient(180deg, rgba(32, 33, 34, 0) 0%, #202122 100%)",
        bottom: 0,
        left: 0,
        right: 0,
      }}
      align="center"
      justify="center"
      isShown={isShown}
    ></FadeOutBox>
  );
});

ScrollBanner.displayName = "ScrollBanner";
