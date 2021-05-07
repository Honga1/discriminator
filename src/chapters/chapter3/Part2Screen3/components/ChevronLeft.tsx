import { memo } from "react";

export const ChevronLeft = memo(() => {
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
        d="M10.0106 20L13 17.0106L5.98938 10L13 2.98938L10.0106 -1.3067e-07L0.0460182 9.9646L0.0814233 10L0.046022 10.0354L10.0106 20Z"
        fill="#FF4E4E"
      />
    </svg>
  );
});

ChevronLeft.displayName = "ChevronLeft";
