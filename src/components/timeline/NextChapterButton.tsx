import { Button } from "grommet";
import React from "react";
import { useNextStep } from "../../hooks/useNextStep";
import { colorTheme } from "../../theme";

export const NextChapterButton = () => {
  const offWhite = colorTheme.offWhite;
  const nextStep = useNextStep();
  return (
    <Button
      onClick={nextStep}
      plain
      icon={
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 6L20 16L4 26V6Z" fill={offWhite} />
          <rect
            width="5"
            height="20"
            transform="matrix(-1 0 0 1 27 6)"
            fill={offWhite}
          />
        </svg>
      }
      color="offWhite"
    />
  );
};
