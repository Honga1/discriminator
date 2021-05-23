import { Button } from "grommet";
import React, { useMemo } from "react";
import { store, useStore } from "../../store/store";
import { colorTheme } from "../../theme";

export const PlayPauseButton = ({ disabled }: { disabled: boolean }) => {
  const icon = useStore((state) =>
    state.chapter?.intention === undefined ||
    state.chapter?.intention === "PAUSE"
      ? "PLAY"
      : "PAUSE"
  );

  const Icon = useMemo(() => {
    if (icon === "PLAY") {
      return <IconPlay />;
    } else {
      return <IconPause />;
    }
  }, [icon]);

  return (
    <Button
      plain
      onClick={onClick}
      icon={Icon}
      color="offWhite"
      disabled={disabled}
    />
  );
};

function IconPause() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="7" y="6" width="6" height="20" fill={colorTheme.offWhite} />
      <rect x="19" y="6" width="6" height="20" fill={colorTheme.offWhite} />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 6L26 16L8 26V6Z" fill={colorTheme.offWhite} />
    </svg>
  );
}

const onClick = () =>
  store.getState().chapter?.getIsPlaying()
    ? store.getState().chapter?.pause()
    : store.getState().chapter?.play();
