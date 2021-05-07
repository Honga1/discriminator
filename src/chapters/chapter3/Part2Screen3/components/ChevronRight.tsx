import { memo } from "react";

export const ChevronRight = memo(() => {
  return (
    <svg
      width="13"
      height="20"
      viewBox="0 0 13 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.98938 -3.94537e-06L-7.43558e-07 2.98938L7.01062 10L3.36986e-06 17.0106L2.98938 20L12.954 10.0354L12.9186 10L12.954 9.96459L2.98938 -3.94537e-06Z"
        fill="#FF4E4E"
      />
    </svg>
  );
});

ChevronRight.displayName = "ChevronRight";
