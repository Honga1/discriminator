import { Box } from "grommet";
import { memo } from "react";

export const MapIcon = memo(() => {
  return (
    <Box width="32px" height="32px">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 7L12 9.57143V25L6 22.4286V7Z" fill="#F8F9FA" />
        <path d="M19 7L13 9.57143V25L19 22.4286V7Z" fill="#F8F9FA" />
        <path d="M20 7L26 9.57143V25L20 22.4286V7Z" fill="#F8F9FA" />
      </svg>
    </Box>
  );
});

MapIcon.displayName = "MapIcon";
