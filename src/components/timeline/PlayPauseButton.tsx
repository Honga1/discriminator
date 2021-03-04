import { Button } from "grommet";
import React from "react";
import { store, useStore } from "../../store/store";
import { colorTheme } from "../../theme";

export const PlayPauseButton = ({ disabled }: { disabled: boolean }) => {
  const offWhite = colorTheme.offWhite;
  const Icon = useStore((state) =>
    state.chapter?.intention === undefined ||
    state.chapter?.intention === "PAUSE" ? (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 6L26 16L8 26V6Z" fill={offWhite} />
      </svg>
    ) : (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="7" y="6" width="6" height="20" fill={offWhite} />
        <rect x="19" y="6" width="6" height="20" fill={offWhite} />
      </svg>
    )
  );

  return (
    <Button
      plain
      onClick={() =>
        store.getState().chapter?.getIsPlaying()
          ? store.getState().chapter?.pause()
          : store.getState().chapter?.play()
      }
      icon={Icon}
      color="offWhite"
      disabled={disabled}
    ></Button>
  );
};
